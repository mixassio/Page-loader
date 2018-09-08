import cheerio from 'cheerio';
import axios from 'axios';
import url from 'url';
import fs from 'fs';
import path from 'path';
import debug from 'debug';

const log = debug('page-loader:page');


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

export default (URI, pathDirSrcSave, pageHtml) => Promise.resolve(log(`Start download pade on: ${URI}`))
  .then(() => {
    log(`create dirrectory for resourse, if needs: ${pathDirSrcSave}`);
    return createDir(pathDirSrcSave);
  })
  .then(() => {
    log('Parsing main page');
    const $ = cheerio.load(pageHtml);
    const links = $('link, script, img')
      .get()
      .map(el => [el.name, el.attribs[mapping[el.name]]])
      .filter(([, link]) => {
        log(`Link resourse: ${link}`);
        if (link) {
          const { host } = url.parse(link);
          return !host;
        }
      });
    return links.map(([name, link]) => ({ tagName: name, ref: mapping[name], path: link }));
  })
  .then((links) => {
    log(`List of links resourses: ${links}`);
    return [Promise.all(links.map((el) => {
      return axios.get(url.resolve(URI, el.path))
        .then((response) => {
          const nameFile = createNewPath(el.path);
          return fs.promises.writeFile(path.resolve(pathDirSrcSave, nameFile), response.data)
        });
    })), links];
  })
  .then(([, links]) => {
    const $ = cheerio.load(pageHtml);
    links.forEach((el) => {
      const nameFile = createNewPath(el.path);
      return $(`${el.tagName}[${el.ref} = "${el.path}"]`).attr(el.ref, path.resolve(pathDirSrcSave, nameFile));
    });
    return $.html();
  })
  .then((html) => { html; })
  .catch((err) => { console.error(err); });
