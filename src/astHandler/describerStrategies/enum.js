export default {
  describe(enuM) {
    const enumElements = enuM.enumElements.members;

    let enumTable = 'Key | Value\n' +
      '---|---\n';

    for (const index in enumElements) {
      const element = enumElements[index];

      enumTable += `${element.propertyName.text()} | ${element.equalsValueClause.value._text}\n`;
    }

    return enumTable;
  },
};
