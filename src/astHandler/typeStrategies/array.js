import TypeManager from '../typeManager';

export default {
  getParameterString: function (astType) {
    astType = TypeManager.getParameterString(astType.type, true);
    astType += '[]';

    return astType;
  },

  getReturnString: function (astType) {
    astType = TypeManager.getReturnString(astType.type, true);
    astType += '[]';

    return astType;
  },

  getDescriptionString: function (astType) {
    astType = TypeManager.getReturnString(astType.type, true);
    astType += '[]';

    return astType;
  },
};
