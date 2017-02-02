import TypeManager from '../typeManager';

export default {
  getParameterString: function (astType) {
    return indexToString(astType);
  },

  getReturnString: function (astType) {
    return indexToString(astType);
  },

  getDescriptionString: function (astType) {
    return indexToString(astType);
  },
};

function indexToString(index) {
  let indexString = '[';

  indexString += TypeManager.getParameterString(index.parameter.identifier, true);

  indexString += ': ' + TypeManager.getReturnString(index.parameter);

  indexString += ']';
  console.log('found index sign');
  return indexString;
}
