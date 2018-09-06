import fs from 'fs';
import axios from 'axios';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';
import srcDownload from './srcDownload';

const mapping = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const downloadPage = (linkDownload, pathDirSave) => {
  const { hostname, pathname } = url.parse(linkDownload);
  const nameFileSave = `${[...hostname.split('.'), ...pathname.split('/')].filter(el => el).join('-')}.html`;
  const pathFileSave = path.resolve(pathDirSave, nameFileSave);
  const nameDirSrcSave = `${[...hostname.split('.')].filter(el => el).join('-')}_files`;
  const pathDirSrcSave = path.resolve(pathDirSave, nameDirSrcSave);
  if (!fs.existsSync(pathDirSrcSave)) {
    fs.mkdirSync(pathDirSrcSave);
  }
  let responseLet = '';
  return axios.get(linkDownload)
    .then((response) => {
      responseLet = response;
      return fs.promises.writeFile(pathFileSave, response.data);
    }).then(() => {
      const $ = cheerio.load(responseLet.data);
      console.log($('script').get().map(el => el.attribs));
      ['link', 'img', 'script'].map(tag => {
        $(tag).each(function () { 
          const linkSrc = $(this).get()[0].attribs[mapping[tag]];
          console.log(srcDownload(linkSrc, pathDirSrcSave));
          $(this).attr(mapping[tag], 'bla-bla'); });
      });
      console.log($.html());
      return responseLet;
    }).catch((err) => {
      console.log(err);
    });
};

export default downloadPage;
