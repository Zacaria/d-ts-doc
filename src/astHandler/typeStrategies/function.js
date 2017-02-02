import TypeManager from '../typeManager';

export default {
  getParameterString: function (astType) {
    return functionToString(astType);
  },

  getReturnString: function (astType) {
    return functionToString(astType);
  },

  getDescriptionString: function (astType) {
    return functionToString(astType);
  },
};

function functionToString(functioN) {
  const parameters = functioN.parameterList.parameters.members;
  const returnType =
    TypeManager.getReturnString(functioN.parameterList.parameters.parent.parent.type, true);

  functioN = '(';
  for (let index in parameters) {
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
