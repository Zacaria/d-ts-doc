import TypeManager from '../typeManager';

export default {
  getParameterString(astType) {
    return objectToString(astType);
  },

  getReturnString(astType) {
    return objectToString(astType);
  },

  getDescriptionString(astType) {
    return objectToString(astType);
  },
};

function objectToString(object) {
  let objectTypeDescription = '{';

  for (const index in object.typeMembers.members) {
    const member = object.typeMembers.members[index];
    objectTypeDescription += ` ${TypeManager.getParameterString(member, true)}`;
    objectTypeDescription += `: ${TypeManager.getReturnString(member)}`;
    if (index != object.typeMembers.members.length - 1) objectTypeDescription += ', ';
  }

  objectTypeDescription += ' }';
  object = objectTypeDescription;

  return object;
}
