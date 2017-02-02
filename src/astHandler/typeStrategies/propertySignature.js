import TypeManager from '../typeManager';

export default {
  getParameterString: function (astType) {
    return propertyToString(astType);
  },

  getReturnString: function (astType) {
    return propertyToString(astType);
  },

  getDescriptionString: function (astType) {
    return propertyToString(astType);
  },
};

function propertyToString(property) {
  return TypeManager.getParameterString(property.propertyName, true);
}
