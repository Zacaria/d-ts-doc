import async from 'async';
import fs from 'fs';
import path from 'path';

const FileWriter = {
  writer: '',
};

FileWriter.setWriter = function (writer) {
  this.writer = writer;
  return this;
};

FileWriter.write = function (file, ast) {
  //return this.handler.write(ast);
  return async.waterfall([
    async.constant(file, ast),
    this.writer.init,
    this.writer.write,
    createMd,
  ], function (err, name) {
    if (err) console.log('Error : ', err);
    else {
      console.log('Done with ', name);
    }
  });
};

function createMd(file, elementName, dataToWrite, temp, cb) {
  //TODO : Instead of making a double extension .tmp.md, create a new dir .tmp
  const filePath = path.join(file.classesLocation, file.version, elementName)
    + (temp ? '.tmp' : '') + '.md';

  fs.writeFile(filePath, dataToWrite, function (err) {
    if (!err) console.log('Md file created');

    cb(err, elementName);
  });
}

export default FileWriter;
