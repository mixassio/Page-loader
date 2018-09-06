import url from 'url';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export default (linkSrc, pathDirSrcSave) => {
  const { pathname } = url.parse(linkSrc);
  const fileSrcName = `${[...pathname.split('/')].filter(el => el).join('-')}`;
  const { name: nameDir } = path.parse(pathDirSrcSave);
  const pathFileSrc = `${nameDir}${path.sep}${fileSrcName}`;
  return axios.get(linkSrc)
    .then((response) => { fs.promises.writeFile(path.resolve(pathDirSrcSave, fileSrcName), response.data); })
    .then(() => pathFileSrc)
    .catch((err) => { console.log(err); });
};
