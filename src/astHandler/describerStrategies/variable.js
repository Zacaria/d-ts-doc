import TypeScript from 'typescript-services';
import TypeManager from '../typeManager';

export default {
  describe(variable) {
    let description = '###';

    // The MemberVariableDeclaration object encapsulates the variable declaration
    if (variable.kind() == TypeScript.SyntaxKind.MemberVariableDeclaration) {
      // add static keyword if needed
      if (variable.modifiers.indexOf(TypeScript.PullElementFlags.Static) > -1) {
        description += ' static';
      }

      variable = variable.variableDeclarator;
    }

    const varName = variable.propertyName.text();

    // Extract the variable type
    const varType = TypeManager.getReturnString(variable);

    // var varType = variable.typeAnnotation.type;

    description += ` ${varName} : ${varType}\n\n`;

    return description;
  },
};
