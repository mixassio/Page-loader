import fs from 'fs';
import axios from 'axios';
import url from 'url';
import path from 'path';
import GetEndHtml from './GetEndHtml';

const createNewPath = (link, ext = '') => {
  const { hostname, pathname } = url.parse(link);
  if (!hostname) {
    return `${[...pathname.split('/')].filter(el => el).join('-')}${ext}`;
  }
  return `${[...hostname.split('.'), ...pathname.split('/')].filter(el => el).join('-')}${ext}`;
};

const downloadPage = (URL, pathDirSave) => {
  const pathFileSave = path.resolve(pathDirSave, createNewPath(URL, '.html'));
  const pathDirSrcSave = path.resolve(pathDirSave, createNewPath(URL, '_files'));
  let responseStart;
  return axios.get(URL)
    .then((response) => {
      responseStart = response;
      return GetEndHtml(URL, pathDirSrcSave, response.data);
    })
    .then((html) => { fs.promises.writeFile(pathFileSave, html); })
    .then(() => responseStart)
    .catch((err) => {
      console.log(err);
    });
};

export default downloadPage;
