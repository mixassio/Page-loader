import fs from 'fs';
import { promisify } from 'util';
import axios from 'axios';
import url from 'url';
import path from 'path';

const writeFileAsync = promisify(fs.writeFile);

const downloadPage = (linkDownload, pathDirSave) => {
  const { hostname, pathname } = url.parse(linkDownload);
  const nameFileSave = `${[...hostname.split('.'), ...pathname.split('/')].filter(el => el).join('-')}.html`;
  const pathFileSave = path.resolve(pathDirSave, nameFileSave);
  console.log('hejjjjjj');
  return new Promise((resolve, reject) => {
    axios.get(linkDownload)
      .then((response) => {
        writeFileAsync(pathFileSave, response.data);
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
  });
};

export default downloadPage;
