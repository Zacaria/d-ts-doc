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
  function setNewDirpath(msg, cb) {
    const newDirPath = path.join(msg.file.classesLocation, msg.file.version);
    const newMsg = {
      ...msg,
      flash: {
        path: newDirPath,
      },
    };
    cb(null, newMsg);
  },
  fsHandler.exists,

  // fsHandler.deleteDir,
  fsHandler.createDir,
  function setSourceFilePath(msg, cb) {
    const newFilePath = path.join(msg.file.location, msg.file.name);
    const newMsg = {
      ...msg,
      flash: {
        path: newFilePath,
      },
    };
    cb(null, newMsg);
  },
  fsHandler.readFile,
  function setSourceFileData(msg, cb) {
    const newMsg = {
      ...msg,
      sourceFileData: msg.flash.readData,
    };
    cb(null, newMsg);
  },
  dtsParser.buildTree,
  function setSourceTree(msg, tree, cb) {
    const newMsg = {
      ...msg,
      flash:{
        ast: tree,
      },
    };
    cb(null, newMsg);
  },
  dtsParser.visitTree,
  resetFlash,
  function setnewClassesDirpath(msg, cb) {
    const newDirPath = path.join(msg.file.classesLocation, msg.file.version);
    const newMsg = {
      ...msg,
      flash: {
        path: newDirPath,
      },
    };
    cb(null, newMsg);
  },
  mdLinksPostProcessor.getNewFilesName,
  mdLinksPostProcessor.addLinks,
], outputConsole);
