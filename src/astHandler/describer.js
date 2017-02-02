/**
 * Extracts description from object, imports old description and formats everything
 * @type {TypeScript|exports|module.exports}
 */

import TypeManager from './typeManager';

const Describer = {
  fileName: '',
  oldDescription: '',
  describer: '',
};

Describer.setFileName = function (fileName) {
  this.fileName = fileName;
  return this;
};

Describer.setOldDescription = function (data) {
  //Before saving it, we need to get rid of links in md
  this.oldDescription = stripMdLinks(data);
  return this;
};

Describer.setDescriber = function (describer) {
  this.describer = describer;
  return this;
};

Describer.describe = function (astElement, withParams) {
  const astFormatted = Describer.describer.describe(astElement);
  const astComments = this.getComments(astElement, astFormatted, withParams);

  return astFormatted + astComments;
};
/**
 * returns comments of the given element
 * @param astElement AST TypeScript object
 * @param withParams boolean tells if the given object is commented with parameters or not
 * @return string
 */
Describer.getComments = function (astElement, astFormatted, withParams) {

  const rawComments = astElement.preComments();
  const stripNewLines = /^\s+|\s+$/g;

  let serializedComments = '';
  let comments = '';
  let typeOfSearch = '';

  //strip new lines before and after the string
  astFormatted = astFormatted.replace(stripNewLines, '');

  //strip spaces around the string
  astFormatted = astFormatted.trim();

  //Espace specials chars, so that this string can be inserted in a regexp
  astFormatted = astFormatted.replace(/([()[{*+.$^\\|?])/g, '\\$1');

  const hasOldData = !!this.oldDescription;
  let searchString;
  let getOldLine;
  let getOldLineWithoutSpace;
  let getOldParams;
  if (hasOldData) {
    searchString = astFormatted;

    // If it's the class description
    if (astFormatted.indexOf('## Description') != -1) {
      typeOfSearch = 'class';
      searchString = '## Description';
    } else if (astFormatted.indexOf('&rarr;') != -1) {

      // Else if it's a function
      typeOfSearch = 'function';
      searchString = astFormatted.substring(0, astFormatted.indexOf('&') + 6);
    } else if (astFormatted.indexOf(':') != -1) {

      // Else if it's a member
      typeOfSearch = 'member';
      searchString = astFormatted.substring(0, astFormatted.indexOf(':'));
    }

    getOldLine = new RegExp(searchString + '\\s*((.*\\s*)*?)(?=^#|$)', 'gm');
    getOldLineWithoutSpace = new RegExp(searchString
        .replace(' ', '') + '\\s*((.*\\s*)*?)(?=^#|$)', 'gm');
    getOldParams = /(^([^\n\r]*)\|([^\n\r]*)$)/gm;
  }

  let oldLineReged = '';
  let oldLineDescription = '';

  //Serialize the array of comments
  for (let i in rawComments) {
    serializedComments += rawComments[i].fullText() + '\n';
  }

  if (!withParams) {
    const textRegexp = /(?=\*\s)(?!\*\n).*$/gm;
    /*
     line will look like :
     '* Description text'
     */
    let line = textRegexp.exec(serializedComments);

    /*
     Iterate over multilines comment
     */
    while (line != null) {
      /*
       take out the first asterisk and space, now looks like
       'Description text'
       */
      comments += line[0].slice(2) + '\n\n';

      line = textRegexp.exec(serializedComments);

    }

    // TODO : Refactor with the other
    if (!comments && hasOldData) {

      oldLineReged = getOldLine.exec(this.oldDescription);
      if (!oldLineReged) {
        oldLineReged = getOldLineWithoutSpace.exec(this.oldDescription);
      }

      if (oldLineReged) {
        oldLineDescription = oldLineReged[1];

        if (typeOfSearch == 'class') {
          oldLineDescription = oldLineDescription.substring(oldLineDescription.indexOf('\n') + 1);
          oldLineDescription = oldLineDescription.substring(oldLineDescription.indexOf('\n') + 1);
          comments += oldLineDescription;
        } else if (typeOfSearch == 'member') {
          comments += oldLineDescription.substring(oldLineDescription.indexOf('\n') + 2);
        } else {
          comments += oldLineDescription;
        }
      }
    }

    comments = comments.replace(stripNewLines, '') + '\n\n';
  } else {
    const notParamRegexp = /(?:^\s*\*\s)(?!\@param)(.*)/gm;
    const funParameters = astElement.callSignature.parameterList.parameters.members;

    let line = notParamRegexp.exec(serializedComments);

    while (line != null) {
      comments += line[1] + '\n\n';
      line = notParamRegexp.exec(serializedComments);
    }

    // TODO : Refactor with the other
    if (!comments && hasOldData) {
      oldLineReged = getOldLine.exec(this.oldDescription);
      if (!oldLineReged) {
        oldLineReged = getOldLineWithoutSpace.exec(this.oldDescription);
      }

      if (oldLineReged) {
        oldLineDescription = oldLineReged[1];

        if (typeOfSearch == 'function') {
          comments += oldLineDescription.substring(oldLineDescription.indexOf('\n') + 2);
        } else {
          comments += oldLineDescription;
        }
      }
    }

    comments = comments.replace(stripNewLines, '') + '\n';

    if (hasOldData && funParameters.length > 0) {
      const oldLineIndex = getOldLine.lastIndex;
      const oldTemp = this.oldDescription.substr(oldLineIndex);

      //We need to execute it twice, before, in order to get rid of results we don't want
      getOldParams.exec(oldTemp);
      getOldParams.exec(oldTemp);

      /**
       * Get the old comments from the arrays
       * @type {Array}
       */
      var paramOldComments = [];
      let paramOldComment = getOldParams.exec(oldTemp);
      while (paramOldComment != null) {
        const start = paramOldComment[0].indexOf('|') + 1;
        const end = paramOldComment[0]
            .substr(paramOldComment[0].indexOf('|') + 1)
            .indexOf('|') - 1 + start;
        const name = paramOldComment[0].substring(start, end);

        paramOldComments[name] = (paramOldComment[0]
            .substr(paramOldComment[0].lastIndexOf('|') + 1)
        );
        paramOldComment = getOldParams.exec(oldTemp);
      }
    }

    let parametersHeader = '#### Parameters\n' +
      ' | Name | Type | Description\n' +
      '---|---|---|---\n';

    let parametersDescription = '';

    parametersDescription += TypeManager
      .getDescriptionString(astElement.callSignature, serializedComments, true);
    parametersDescription += '\n';

    /**
     * Add the old comments in the new .md
     * In the arrays of ##Params
     */

    let paramDescLine = [];
    let searchBreak = parametersDescription.search(/\n/);

    while (searchBreak != -1) {
      const line = parametersDescription.substring(0, searchBreak);
      const start = line.indexOf('|') + 1;
      const end = line.substr(line.indexOf('|') + 1).indexOf('|') - 1 + start;
      const name = line.substring(start, end);

      paramDescLine[name] = line;
      parametersDescription = parametersDescription
        .slice(searchBreak + 1, parametersDescription.length - 1);

      searchBreak = parametersDescription.search(/\n/);
    }

    parametersDescription = '';
    for (let index in paramDescLine) {
      // If there was description
      if (paramOldComments && paramOldComments[index]) {
        // Merge the comments with the new description
        parametersDescription += paramDescLine[index] + paramOldComments[index] + '\n';
      } else {
        // Just add the new one
        parametersDescription += paramDescLine[index] + '\n';
      }
    }

    if (funParameters.length > 0) {
      comments += '\n' + parametersHeader + parametersDescription;
    }
  }

  return comments;
};

Describer.getMetas = function () {

  // This retrieve all the metas from first '---' to second '---'
  // (searched with '---' and '##' because don't work with newline character
  const beginMetasToken = '---';
  const endMetasToken = '##';
  let oldMetas = this.oldDescription
    .substring(0, this.oldDescription
        .indexOf(endMetasToken, this.oldDescription
          .indexOf(beginMetasToken)) + endMetasToken.length);
  if (oldMetas) {
    // Delete the '##' found and replace it with a newline
    oldMetas = oldMetas.substring(0, oldMetas.lastIndexOf('---') + 3);
    oldMetas += '\n';
  }

  const defaultMetas = '---\nTAGS:\n---\n';

  return (oldMetas ? oldMetas : defaultMetas);
};

function stripMdLinks(mdData) {
  const getMdLinks = /\[(\w+)\]\(.*?\)/g;
  return mdData ? mdData.replace(getMdLinks, '$1') : '';
}

export default Describer;
