/**
 * Holds the typescript definition parser
 * @type {TypeScript|exports|module.exports}
 */

import TypeScript from 'typescript-services';
import async from 'async';

import FileWriter from './astHandler/FileWriter';
import ClassWriter from './astHandler/fileWriterStrategies/class';
import EnumWriter from './astHandler/fileWriterStrategies/enum';

/**
 * Parses .d.ts string
 * Outputs an  Abstract Syntax Tree
 * @param text input
 * @param cb
 */
export const buildTree = function(msg, cb) {
  console.log('I am the tree builder !');

  //A plain array of JSON elements, including classes, enums, interfaces
  //TODO get rid of that
  //var elements = [];

  const syntaxTree = TypeScript.Parser.parse(msg.file.name,
    TypeScript.SimpleText.fromString(msg.sourceFileData),
    true /* is .d.ts? */,
    new TypeScript.ParseOptions(TypeScript.LanguageVersion.EcmaScript5, true /* allow ASI? */));

  const cs = new TypeScript.CompilationSettings();
  cs.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;

  const sourceUnit = TypeScript.SyntaxTreeToAstVisitor.visit(syntaxTree, msg.file.name, cs, false);

  cb(null, msg, sourceUnit.moduleElements);
};

/**
 * Recursive function exploring the tree
 * Recursivity is used to handle the module nesting
 * @param file
 * @param treeInput
 * @param elements
 * @param cb callback which passes the result to the next function of the waterfall
 */
export const visitTree = function(msg, cb) {
  console.log('let\'s visit this');

  async.eachSeries(
    msg.flash.ast.members,
    function (item, endIteration) {
      const me = item;

      if (me.kind() == TypeScript.SyntaxKind.ModuleDeclaration) {
        const md = me;
        /**
         * We are not interested into modules, let's just dig deeper into the tree
         */
        msg.flash.ast = md.moduleElements;
        visitTree(msg, endIteration);

      } else if (me.kind() == TypeScript.SyntaxKind.ClassDeclaration) {
        const cd = me;

        if (cd.modifiers.indexOf(TypeScript.PullElementFlags.Private) > -1
          || cd.identifier.text().charAt(0) == '_') {
          endIteration();
        } else {
          /**
           * When we reach a class, create it and fill it up
           */
          msg.flash.ast = cd;
          const classWriter = new FileWriter();
          classWriter.setWriter(ClassWriter).write(msg, endIteration);
        }

      } else if (me.kind() == TypeScript.SyntaxKind.EnumDeclaration) {
        const ed = me;
        /**
         * Enumerations are handled the same way as classes
         */
        msg.flash.ast = ed;
        const enumWriter = new FileWriter();
        enumWriter.setWriter(EnumWriter).write(msg, endIteration);
      } else {
        endIteration();
      }
    },
    function (err) {
      cb(err, msg);
    }
  );
};
