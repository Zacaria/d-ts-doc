import TypeManager from '../typeManager';

export default {
  getParameterString: function (astType) {
    return objectToString(astType);
  },

  getReturnString: function (astType) {
    return objectToString(astType);
  },

  getDescriptionString: function (astType) {
    return objectToString(astType);
  },
};

function objectToString(object) {
  let objectTypeDescription = '{';

  for (let index in object.typeMembers.members) {
    const member = object.typeMembers.members[index];
    objectTypeDescription += ' ' + TypeManager.getParameterString(member, true);
    objectTypeDescription += ': ' + TypeManager.getReturnString(member);
    if (index != object.typeMembers.members.length - 1) objectTypeDescription += ', ';
  }

  objectTypeDescription += ' }';
  object = objectTypeDescription;

  return object;
}
