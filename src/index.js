import fs from 'fs';
import axios from 'axios';
import url from 'url';
import path from 'path';

const downloadPage = (linkDownload, pathDirSave) => {
  const { hostname, pathname } = url.parse(linkDownload);
  const nameFileSave = `${[...hostname.split('.'), ...pathname.split('/')].filter(el => el).join('-')}.html`;
  const pathFileSave = path.resolve(pathDirSave, nameFileSave);
  return axios.get(linkDownload)
    .then((response) => {
      fs.promises.writeFile(pathFileSave, response.data)
        .catch((errWr) => { console.log(errWr); });
      return response;
    }).catch((err) => {
      console.log(err);
    });
};

export default downloadPage;
