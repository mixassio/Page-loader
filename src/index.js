import fs from 'fs';
import axios from 'axios';
import url from 'url';
import path from 'path';
import debug from 'debug';
import getSrcHtml from './getSrcHtml';

const log = debug('page-loader:app');

const createNewPath = (link, ext = '') => {
  const { hostname, pathname } = url.parse(link);
  if (!hostname) {
    return `${[...pathname.split('/')].filter(el => el).join('-')}${ext}`;
  }
  return `${[...hostname.split('.'), ...pathname.split('/')].filter(el => el).join('-')}${ext}`;
};

const testDirUrl = (dir, uri) => {
  log('Testing exist directiry and check uri');
  return Promise.resolve()
    .then(() => {
      log(`Parsing URL ${uri}`);
      const { host } = url.parse(uri);
      if (!host) {
        throw new Error('URL is bad');
      }
      return true;
    })
    .then(() => {
      log(`Testing exist DIR: ${dir}`);
      return fs.promises.readdir(dir);
    })
    .catch((err) => {
      if (err.code) {
        switch (err.code) {
          case 'ENOENT':
            throw new Error(`${dir} not exist.`);
          case 'EACCES':
            throw new Error(`Not acces to ${dir}`);
          default:
            throw err.code;
        }
      }
      console.error(err);
    });
};

const pageDownloader = (uri) => {
  log(`Start to download page: ${uri}`);
  return axios.get(uri)
    .then((response) => {
      log(`Status ${uri}: ${response.status}`);
      return response;
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(`${uri} has status ${err.response.status}`);
      }
      console.error(err);
    });
};

const downloadPage = (uri, pathDirSave) => {
  log('Start load main page');
  const pathFileSave = path.resolve(pathDirSave, createNewPath(uri, '.html'));
  const pathDirSrcSave = path.resolve(pathDirSave, createNewPath(uri, '_files'));
  log(`Path main page: ${pathFileSave}, path dirrectory for local resource ${pathDirSrcSave}`);
  let responseStart;
  return testDirUrl(pathDirSave, uri)
    .then(() => pageDownloader(uri))
    .then((response) => {
      log(`response-status main page: ${response.status}`);
      responseStart = response;
      return getSrcHtml(uri, pathDirSrcSave, response.data);
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
