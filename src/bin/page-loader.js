#!/usr/bin/env node
import program from 'commander';
import debug from 'debug';
import downloadPage from '..';

const log = debug('page-loader');

program
  .description('Download site from url to file')
  .version('0.0.1')
  .arguments('<link>')
  .option('-o, --output <path>', 'Output dir', process.cwd())
  .action((linkDownload) => {
    log('Start working utilite');
    downloadPage(linkDownload, program.output)
      .then(() => log('Page and resourses were load'))
      .catch((err) => {
        console.error(err.message);
        process.exit(1);
      });
  })
  .parse(process.argv);
