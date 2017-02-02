/**
 * File system helper
 * @type {*}
 */
import path from 'path';
import fs from 'fs';

/**
 * Reads the sourcefile
 * @param cb
 * @return file string
 */
export const readFile = (msg, cb) => {
  fs.readFile(msg.flash.path, { encoding: 'utf8' }, (err, text) => {
    console.log('I am reading ..' + msg.flash.path);

    msg.flash = {
      readData: text
    };
    cb(err, msg);
  });
};

export const exists = (msg, cb) => {
  fs.exists(msg.flash.path, exists => {
    msg.flash.exists = exists;
    cb(null, msg);
  });
};

export const createDir = (msg, cb) => {
  fs.mkdir(msg.flash.path, err => {
    if (!err) console.log('new Directory created : ', msg.flash);
    cb(err, msg);
  });
};

export const readdir = (msg, cb) => {
  fs.readdir(msg.flash.path, (err, files) => {
    msg.files = files;
    cb(err, msg);
  });
};

export const writeFile = (msg, cb) => {
  fs.writeFile(msg.flash.filePath, msg.flash.dataToWrite, err => {
    const basename = path.basename(msg.flash.filePath, '.md');
    if (!err) console.log('file created : ', basename);

    cb(err, msg);
  });
};
