import TypeManager from '../typeManager';

export default {
  getParameterString(astType) {
    astType = TypeManager.getParameterString(astType.type, true);
    astType += '[]';

    return astType;
  },

  getReturnString(astType) {
    astType = TypeManager.getReturnString(astType.type, true);
    astType += '[]';

    return astType;
  },

  getDescriptionString(astType) {
    astType = TypeManager.getReturnString(astType.type, true);
    astType += '[]';

    return astType;
  },
};
