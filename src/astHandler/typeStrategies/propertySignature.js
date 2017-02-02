import TypeManager from '../typeManager';

export default {
  getParameterString(astType) {
    return propertyToString(astType);
  },

  getReturnString(astType) {
    return propertyToString(astType);
  },

  getDescriptionString(astType) {
    return propertyToString(astType);
  },
};

function propertyToString(property) {
  return TypeManager.getParameterString(property.propertyName, true);
}
