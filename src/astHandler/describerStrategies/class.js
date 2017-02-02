import TypeScript from 'typescript-services';

export default {
  describe(clasS) {
    const name = clasS.identifier.text();
    const heritageClauses = clasS.heritageClauses.members;

    let description = '## Description\n\n';
    let classExtends = '';

    for (const index in heritageClauses) {
      const clause = heritageClauses[index];

      if (clause.kind() === TypeScript.SyntaxKind.ExtendsHeritageClause) {
        if (clause.typeNames.members[0].text) {
          classExtends = clause.typeNames.members[0].text();
        } else if (clause.typeNames.members[0].name) {
          classExtends = clause.typeNames.members[0].name._text;
        } else {
          classExtends = `${clause.typeNames.members[0].left._text}.${
             clause.typeNames.members[0].right._text}`;
        }
      }

      // else if (clause.kind() === TypeScript.SyntaxKind.ImplementsHeritageClause) {
      //    classImplements = clause.typeNames.members[0].text();
      // }
    }

    description += `class ${name
      }${classExtends ? ` extends ${classExtends}` : ''}\n\n`;

    // classImplements ? description = '##Implements:' +  classImplements +'\n'+ description : null;

    return description;
  },
};
