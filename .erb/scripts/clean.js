import rimraf from 'rimraf';
import fs from 'fs';
import webpackPaths from '../configs/webpack.paths';

const foldersToRemove = [
  webpackPaths.distPath,
  webpackPaths.buildPath,
  webpackPaths.dllPath,
];

// foldersToRemove.forEach((folder) => {
//   if (fs.existsSync(folder)) rimraf.sync(folder);
// });

console.log('Folders to remove:', foldersToRemove);
foldersToRemove.forEach((folder) => {
  console.log('Checking folder:', folder);
  if (fs.existsSync(folder)) {
    console.log(`Removing folder: ${folder}`);
    rimraf.sync(folder);
  } else {
    console.log(`Folder not found: ${folder}`);
  }
});
