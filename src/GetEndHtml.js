import cheerio from 'cheerio';
import axios from 'axios';
import url from 'url';
import fs from 'fs';
import path from 'path';

const createDir = Path => fs.promises.readdir(Path)
  .catch((err) => { fs.promises.mkdir(Path); })
  .then(() => null);

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

export default (URL, pathDirSrcSave, pageHtml) => Promise.resolve()
  .then(() => createDir(pathDirSrcSave))
  .then(() => {
    const $ = cheerio.load(pageHtml);
    const links = $('link, script, img')
      .get()
      .map(el => [el.name, el.attribs[mapping[el.name]]])
      .filter((el) => {
        const { host } = url.parse(el[1]);
        return !host;
      });
    return links.map(el => ({ tagName: el[0], ref: mapping[el[0]], path: el[1] }));
  })
  .then((links) => [Promise.all(links.map((el) => {
    return axios.get(url.resolve(URL, el.path))
      .then((response) => {
        const nameFile = createNewPath(el.path);
        return fs.promises.writeFile(path.resolve(pathDirSrcSave, nameFile), response.data)
      })
  })), links])
  .then(([, links]) => {
    const $ = cheerio.load(pageHtml);
    links.forEach((el) => {
      const nameFile = createNewPath(el.path);
      return $(`${el.tagName}[${el.ref} = "${el.path}"]`).attr(el.ref, path.resolve(pathDirSrcSave, nameFile));
    });
    return $.html();
  })
  .then((html) => html)
