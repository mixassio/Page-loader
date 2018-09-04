#!/usr/bin/env node
import program from 'commander';
import downloadPage from '..';

program
  .description('Download site from url to file')
  .version('0.0.1')
  .arguments('<link>')
  .option('-o, --output <path>', 'Output dir')
  .action((linkDownload) => {
    const pathDir = (program.output) ? program.output : process.env.PWD;
    downloadPage(linkDownload, pathDir);
  })
  .parse(process.argv);
