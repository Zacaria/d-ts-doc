import TypeManager from '../typeManager';

export default {
  getParameterString: function (astType) {
    return genericToString(astType);
  },

  getReturnString: function (astType) {
    return genericToString(astType);
  },

  getDescriptionString: function (astType) {
    return genericToString(astType);
  },
};

function genericToString(generic) {
  const argumentList = generic.typeArgumentList.typeArguments.members;

  generic = TypeManager.getReturnString(generic.name, true);

  generic += '&lt;';
  for (let index in argumentList) {
    generic += TypeManager.getParameterString(argumentList[index], true);
    if (index < argumentList.length - 1) {
      generic += ', ';
    }
  }

  generic += '&gt;';

  return generic;
}
