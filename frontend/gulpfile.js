const { src, dest, series } = require('gulp');
const del = require('del');
const fs   = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
const exec = require('child_process').exec;

const paths = {
  prod_build: '../frontend-build',
  vue_src: '../frontend/dist/**/*',
  vue_dist: '../frontend-build/frontend/dist',
  zipped_file_name: 'frontend-nodejs.zip'
};

function clean()  {
  log('removing the old files in the directory')
  return del('../frontend-build/**', {force:true});
}

function createProdBuildFolder() {

  const dir = paths.prod_build;
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('📁  folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}

function buildVueCodeTask(cb) {
  log('building Vue code into the directory')
  return exec('cd ../frontend && npm run build', function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  })
}

function copyVueCodeTask() {
  log('copying Vue code into the directory')
  return src(`${paths.vue_src}`)
        .pipe(dest(`${paths.vue_dist}`));
}

function zippingTask() {
  log('zipping the code ')
  return src(`${paths.prod_build}/**`)
      .pipe(zip(`${paths.zipped_file_name}`))
      .pipe(dest(`${paths.prod_build}`))
}

function deleteDistBuildFolder() {
  log('deleting dist build folder')
  return del('./dist', {force:true})
}

exports.default = series(
  clean,
  createProdBuildFolder,
  buildVueCodeTask,
  copyVueCodeTask,
  zippingTask,
  deleteDistBuildFolder
);