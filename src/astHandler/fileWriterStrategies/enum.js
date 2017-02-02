import Describer from '../describer';
import enumDescriber from '../describerStrategies/enum';

export default {
  init(msg, cb) {
    msg.astName = msg.flash.ast.identifier.text();
    msg.ast = msg.flash.ast;

    // console.log('I enumerate !', msg.ast.identifier.text());
    cb(null, msg);
  },

  write(msg, cb) {
    const enumName = msg.ast.identifier.text();

    Describer.setFileName(enumName);

    let enumContent = '';
    const enumMetas = Describer.setDescriber(enumDescriber).getMetas();
    const enumHeader = `##${enumName} enumeration\n\n`;
    const enumDescription = Describer.describe(msg.ast);

    enumContent += enumMetas + enumHeader + enumDescription;

    cb(null, msg, enumContent);
  },
};
