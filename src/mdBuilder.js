/**
 * Holds functions parsing imported classes
 */
import fs from 'fs';
import path from 'path';

const __DIRNAME__ = 'content/classes/';

/**
 * Now the real thing is coming: build every MD pages corresponding to the JSON
 * values
 * @param pages
 * @return none
 */
export const buildMDDir = function(pages) {
  pages.forEach(function(page) {
    if (dirExists(page.version)) {
      // build the page
      buildMDpage(page);
    } else {
      // build the directory before building the page
      fs.mkdirSync(path.join(__DIRNAME__, page.version));
      buildMDpage(page);
    }
  });
};

/**
 * Returns true or false if the directory already exists.
 * @param dir_path
 * @return boolean
 */
export const dirExists = function(DIR_NAME) {
  const directories = fs.readdirSync(__DIRNAME__);

  let res = false;

  directories.forEach(function(directory) {
    res = (directory == DIR_NAME) || res;
  });

  return res;
};

/**
 * Builds the MD page from the
 * @param input page Object
 */
export const buildMDpage = function(page) {

  if (page.content === 'default content' || page.title.charAt(0) === '_') return;

  let data =
    '---\n' +
    'ID_PAGE: ' + page.id + '\n' +
    'PG_TITLE: ' + page.title + '\n' +
    'PG_VERSION: ' + page.version + '\n' +
    '---\n' +
    page.content;

  let replaceChar = '';
  const regEx = /\<\w*\>/g;

  const filename = path.join(__DIRNAME__, page.version, page.title.replace(regEx, replaceChar)) +
    '.md';

  fs.writeFileSync(filename, data);
};
