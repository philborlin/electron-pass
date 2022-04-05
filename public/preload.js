// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require("electron");
const fs = require('fs/promises')
const os = require("os")
const path = require("path")
const { getFilesFromDirectory } = require('../src/preload/filelist')

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
  contextBridge.exposeInMainWorld("dir", dir);
});

async function dir() {
  // return getFilesFromDirectory(os.homedir() + '/.password-store')
  // return getFilesFromDirectory(fs, path, os.homedir() + '/.password-store')
  const files = getFilesFromDirectory(fs, path, os.homedir() + '/.password-store')
  console.log('files', files)
  return files
}

// const getFilesFromDirectory = async (directoryPath) => {
//   const filesInDirectory = await fs.readdir(directoryPath)
//   const files = await Promise.all(
//     filesInDirectory.
//       filter(file => !(/(^|\/)\.[^\/\.]/g).test(file)).
//       map(async (file) => {
//         const filePath = path.join(directoryPath, file)
//         const stats = await fs.stat(filePath)

//         if (stats.isDirectory()) {
//           return getFilesFromDirectory(filePath)
//         } else {
//           return filePath;
//         }
//       })
//   );
//   return files.filter((file) => file.length); // return with empty arrays removed
// }