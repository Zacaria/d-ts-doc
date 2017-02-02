/**
 * Holds functions parsing imported classes
 */
import fs from 'fs';
import path from 'path';

const DIRNAME = 'content/classes/';

/**
 * Builds the MD page from the
 * @param input page Object
 */
export const buildMDpage = (page) => {
  if (page.content === 'default content' || page.title.charAt(0) === '_') return;

  const data =
    `${'---\n' +
    'ID_PAGE: '}${page.id}\n` +
    `PG_TITLE: ${page.title}\n` +
    `PG_VERSION: ${page.version}\n` +
    `---\n${
      page.content}`;

  const replaceChar = '';
  const regEx = /<\w*>/g;

  const filename = `${path.join(DIRNAME, page.version, page.title.replace(regEx, replaceChar))
    }.md`;

  fs.writeFileSync(filename, data);
};


/**
 * Returns true or false if the directory already exists.
 * @param dir_path
 * @return boolean
 */
export const dirExists = (DIR_NAME) => {
  const directories = fs.readdirSync(DIRNAME);

  let res = false;

  directories.forEach((directory) => {
    res = (directory === DIR_NAME) || res;
  });

  return res;
};

/**
 * Now the real thing is coming: build every MD pages corresponding to the JSON
 * values
 * @param pages
 * @return none
 */
export const buildMDDir = (pages) => {
  pages.forEach((page) => {
    if (dirExists(page.version)) {
      // build the page
      buildMDpage(page);
    } else {
      // build the directory before building the page
      fs.mkdirSync(path.join(DIRNAME, page.version));
      buildMDpage(page);
    }
  });
};
