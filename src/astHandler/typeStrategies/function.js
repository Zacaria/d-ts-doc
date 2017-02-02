import TypeManager from '../typeManager';

export default {
  getParameterString(astType) {
    return functionToString(astType);
  },

  getReturnString(astType) {
    return functionToString(astType);
  },

  getDescriptionString(astType) {
    return functionToString(astType);
  },
};

function functionToString(functioN) {
  const parameters = functioN.parameterList.parameters.members;
  const returnType =
    TypeManager.getReturnString(functioN.parameterList.parameters.parent.parent.type, true);

  functioN = '(';
  for (const index in parameters) {
    if (!parameters[index].typeAnnotation) {
      functioN += parameters[index].identifier._text; // jch updated here
    } else {
      functioN += parameters[index].typeAnnotation.parent.identifier._text;
    }

    functioN += ': ';
    functioN += TypeManager.getParameterString(parameters[index]);
    if (index < parameters.length - 1) {
      functioN += ', ';
    }
  }

  functioN += ') =&gt; ';
  functioN += returnType;

  return functioN;
}
