import TypeManager from '../typeManager';

export default {
  getParameterString: function (astType) {
    const funParameters = astType.parameterList.parameters.members;
    let funSignature = '(';

    for (let index in funParameters) {
      let parameter = funParameters[index];

      funSignature += parameter.identifier.text();
      if (index < funParameters.length - 1) {
        funSignature += ', ';
      }
    }

    funSignature += ')';

    return funSignature;

  },

  getReturnString: function (astType) {
    let funParameters = null;
    if (!astType.parameterList) {
      if (!astType.propertyName) {
        return '()';
      } else {
        funParameters = { 0: astType.propertyName };
      }
    } else {
      funParameters = astType.parameterList.parameters.members;
    }

    let funSignature = '(';

    for (let index in funParameters) {
      let parameter = funParameters[index];
      if (parameter) {
        if (parameter.identifier) {
          funSignature += parameter.identifier.text();
        }

        if (index < funParameters.length - 1) {
          funSignature += ', ';
        }
      }
    }

    funSignature += ')';
    console.log('Current function:', funSignature);

    return funSignature;
  },

  getDescriptionString: function (astType, description) {
    let parametersDescription = '';
    const funParameters = astType.parameterList.parameters.members;
    const paramRegexp = /(?:\*\s\@param\s+)(\w*)(.*)/gm;

    for (let index in funParameters) {
      let parameter = funParameters[index];
      const parameterName = TypeManager.getParameterString(parameter.identifier, true);

      //var parameterName = parameter.identifier.text();
      const parameterType = parameter.typeAnnotation ? parameter.typeAnnotation.type : null;

      /**
       * This section handles the following case
       * constructor(n: number | any)
       */
      if (!parameterType) {
        parametersDescription = [
          parametersDescription.slice(
            0,
            parametersDescription.length - 3),
          'or ' + parameterName + ' ',
          parametersDescription.slice(parametersDescription.length - 3
          ),
        ].join('');
        continue;
      }

      //optional parameter
      parameter.questionToken
        ? parametersDescription += 'optional | '
        : parametersDescription += ' | ';

      //name of the parameter
      parametersDescription += parameterName + ' | ';

      parametersDescription += TypeManager.getDescriptionString(parameter);

      parametersDescription += ' | ';

      //description of the parameter
      let paramLine = paramRegexp.exec(description);

      //We need to find the line that comments our parameter
      while (paramLine != null) {
        if (paramLine[1] == parameterName) {
          parametersDescription += paramLine[2];
        }

        paramLine = paramRegexp.exec(description);
      }

      //break line to go to the next parameter
      parametersDescription += '\n';

      //add a second line break if it is the last element of the table
      if (index == funParameters.length - 1) parametersDescription += '\n';
    }

    return parametersDescription;
  },
};
