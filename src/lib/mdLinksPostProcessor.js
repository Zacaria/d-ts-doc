/**
 * add markdown links into data pointing to classes
 * @type {exports|module.exports}
 */

import path from 'path';
import async from 'async';
import * as fsHandler from './fsHandler';


function applyRegexp(msg, cb) {
  const classeNames = msg.files;
  let newData = msg.flash.readData;

  // save metas
  const beginMetasToken = '---';
  const endMetasToken = '\n---';
  const endOfMetasIndex = newData.indexOf(endMetasToken, newData.indexOf(beginMetasToken))
    + endMetasToken.length;
  let oldMetas = newData.substring(0, endOfMetasIndex);
  const defaultMetas = '---\nTAGS:\n---\n';
  if (!oldMetas) oldMetas = defaultMetas;

  // delete metas from data before adding links
  newData = newData.substring(endOfMetasIndex);

  async.each(
    classeNames,
    (className, endIteration) => {
      const surroundbyLink = new RegExp(`\\b${path.basename(className, '.md')}\\b`, 'gm');
      newData = newData.replace(surroundbyLink, `[$&](/classes/${msg.file.version}/$&)`);
      endIteration();
    }, (err) => {
      msg.newData = oldMetas + newData;
      cb(err, msg);
    },
  );
}

export const getNewFilesName = (msg, cb) => {
  fsHandler.readdir(msg, cb);
};

export const addLinks = (msg, cb) => {
  const classeNames = msg.files;
  const dirPath = path.join(msg.file.classesLocation, msg.file.version);

  async.eachSeries(
    classeNames,
    (className, endIteration) => {
      async.waterfall([
        async.constant(msg),
        (msg, cb) => {
          msg.flash = {
            path: path.join(dirPath, className),
          };
          cb(null, msg);
        },
        fsHandler.readFile,
        applyRegexp,
        (msg, cb) => {
          msg.flash = {
            dataToWrite: msg.newData,
            filePath: path.join(dirPath, className),
          };
          cb(null, msg);
        },
        fsHandler.writeFile,
      ],
        (err) => {
          if (err) console.log('Adding links failed for : ', className, '\nWith error :', err);
          else console.log('Adding links succeed for :', className);

          endIteration();
        });
    }, (err) => {
      cb(err, msg);
    },
  );
};
