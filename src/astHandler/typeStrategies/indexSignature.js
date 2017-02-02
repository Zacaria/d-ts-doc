import TypeManager from '../typeManager';

export default {
  getParameterString(astType) {
    return indexToString(astType);
  },

  getReturnString(astType) {
    return indexToString(astType);
  },

  getDescriptionString(astType) {
    return indexToString(astType);
  },
};

function indexToString(index) {
  let indexString = '[';

  indexString += TypeManager.getParameterString(index.parameter.identifier, true);

  indexString += `: ${TypeManager.getReturnString(index.parameter)}`;

  indexString += ']';
  console.log('found index sign');
  return indexString;
}
