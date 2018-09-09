import cheerio from 'cheerio';
import axios from 'axios';
import url from 'url';
import fs from 'fs';
import path from 'path';
import debug from 'debug';

const log = debug('page-loader:page');

const ChooseResponseType = {
  '.png': 'arraybuffer',
  '.jpeg': 'arraybuffer',
  '.jpg': 'arraybuffer',
  '.js': 'text',
  '.css': 'text',
  '.xml': 'text',
  '.gif': 'arraybuffer',
};

const createDir = Path => fs.promises.readdir(Path)
  .catch(() => {
    log('Directory was created.');
    return fs.promises.mkdir(Path);
  });

const createNewPath = (link, ext = '') => {
  const { hostname, pathname } = url.parse(link);
  if (!hostname) {
    return `${[...pathname.split('/')].filter(el => el).join('-')}${ext}`;
  }
  return `${[...hostname.split('.'), ...pathname.split('/')].filter(el => el).join('-')}${ext}`;
};
const mapping = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const createListLinks = (pageHtml, pathDirSrcSave) => {
  log('Parsing main page');
  const $ = cheerio.load(pageHtml);
  const filtered = $('link, script, img')
    .get()
    .map(el => [el.name, el.attribs[mapping[el.name]]])
    .filter(([, el]) => el)
    .filter(([, link]) => {
      const { host } = url.parse(link);
      return !host;
    });
  const links = filtered.map(([name, link]) => ({ tagName: name, ref: mapping[name], path: link }));
  log(`Count links for dowmload: ${links.length}`);
  links.forEach((el) => {
    const nameFile = createNewPath(el.path);
    $(`${el.tagName}[${el.ref} = "${el.path}"]`).attr(el.ref, path.resolve(pathDirSrcSave, nameFile));
  });
  return [links, $.html()];
};

export default (uri, pathDirSrcSave, pageHtml) => {
  const [linksSrc, pageModify] = createListLinks(pageHtml, pathDirSrcSave);
  return createDir(pathDirSrcSave)
    .then(() => {
      log('Start download resourse from links');
      return Promise.all(linksSrc.map((el) => {
        log(`Downloding${el.path}`);
        const { ext } = path.parse(el.path);
        const responseType = (ChooseResponseType[ext]) ? ChooseResponseType[ext] : 'text';
        return axios.get(url.resolve(uri, el.path), { responseType })
          .then((response) => {
            log(`Response status:${response.status}`);
            const nameFile = createNewPath(el.path);
            const dataResponse = (el.tagName === 'img') ? Buffer.from(response.data) : response.data;
            return fs.promises.writeFile(path.resolve(pathDirSrcSave, nameFile), dataResponse);
          });
      }));
    })
    .then(() => {
      log('links were loaded');
      return pageModify;
    });
};
