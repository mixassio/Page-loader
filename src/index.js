import fs from 'fs';
import axios from 'axios';
import url from 'url';
import path from 'path';
import debug from 'debug';
import GetEndHtml from './GetEndHtml';

const log = debug('page-loader:app');

const createNewPath = (link, ext = '') => {
  const { hostname, pathname } = url.parse(link);
  if (!hostname) {
    return `${[...pathname.split('/')].filter(el => el).join('-')}${ext}`;
  }
  return `${[...hostname.split('.'), ...pathname.split('/')].filter(el => el).join('-')}${ext}`;
};

const downloadPage = (URL, pathDirSave) => {
  log('Start load main page');
  const pathFileSave = path.resolve(pathDirSave, createNewPath(URL, '.html'));
  const pathDirSrcSave = path.resolve(pathDirSave, createNewPath(URL, '_files'));
  log(`Path main page: ${pathFileSave}, path dirrectory for local resource ${pathDirSrcSave}`);
  let responseStart;
  return axios.get(URL)
    .then((response) => {
      log(`response-status main page: ${response.status}`);
      responseStart = response;
      return GetEndHtml(URL, pathDirSrcSave, response.data);
    })
    .then((html) => {
      log('Page was load');
      return fs.promises.writeFile(pathFileSave, html);
    })
    .then(() => {
      log(`Page was saved on path${pathFileSave}`);
      return responseStart;
    })
    .catch((err) => {
      if (err.response) {
        console.error(err.response.status);
      }
      console.error(err.code);
      return Promise.reject(err);
    });
};

export default downloadPage;
