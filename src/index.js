/**
 * The purpose of this file is to generate the new doc by also migrating the existing comments
 *
 * @type {exports}
 */
import path from 'path';
import async from 'async';
import * as fsHandler from './lib/fsHandler';
import * as dtsParser from './dtsParser';
import * as mdLinksPostProcessor from './lib/mdLinksPostProcessor';
import { file } from './config';

const initMsg = {
  file,

  // flash is a temporary cache memory
  flash: {},
};

// Function executed once the waterfall has finished
function outputConsole(err) {
  if (err) console.log('Unexpected problem : ', err);
  else console.log('Everything was fine ');
}

function patchFlashPath(newPath, msg) {
  return {
    ...msg,
    flash: {
      path: newPath,
    },
  };
}

function resetFlash(msg, cb) {
  const cleanMsg = {
    ...msg,
    flash: {},
  };
  cb(null, cleanMsg);
}

// TODO delete dir when error is raised
async.waterfall([
  async.constant(initMsg),
  (msg, cb) => {
    const newDirPath = path.join(msg.file.classesLocation, msg.file.version);
    cb(null, patchFlashPath(newDirPath, msg));
  },
  fsHandler.exists,

  // fsHandler.deleteDir,
  fsHandler.createDir,
  (msg, cb) => {
    const newFilePath = path.join(msg.file.location, msg.file.name);
    cb(null, patchFlashPath(newFilePath, msg));
  },
  fsHandler.readFile,
  (msg, cb) => {
    const newMsg = {
      ...msg,
      sourceFileData: msg.flash.readData,
    };
    cb(null, newMsg);
  },
  dtsParser.buildTree,
  (msg, tree, cb) => {
    const newMsg = {
      ...msg,
      flash: {
        ast: tree,
      },
    };
    cb(null, newMsg);
  },
  dtsParser.visitTree,
  resetFlash,
  (msg, cb) => {
    const newDirPath = path.join(msg.file.classesLocation, msg.file.version);
    cb(null, patchFlashPath(newDirPath, msg));
  },
  mdLinksPostProcessor.getNewFilesName,
  mdLinksPostProcessor.addLinks,
], outputConsole);
