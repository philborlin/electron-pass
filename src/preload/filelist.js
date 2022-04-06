async function getFilesFromDirectory(fs, pathUtil, directoryPath) {
  const firstPath = directoryPath

  const loop = async (directoryPath, key) => {
    // const filesInDirectory = await fs.readdir(directoryPath)
    const filesInDirectory = await fs.readdir(directoryPath)
    const objs =  await Promise.all(
      filesInDirectory.
        filter(file => !(/(^|\/)\.[^\/\.]/g).test(file)).
        map(async (file, index) => {
          const filePath = pathUtil.join(directoryPath, file)
          const newKey = key + index
          const stats = await fs.stat(filePath)

          if (stats.isDirectory()) {
            return { title: file, key: newKey, children: await loop(filePath, newKey + '-'), path: getPath(pathUtil, firstPath, directoryPath, file) }
          } else if (file.endsWith('.gpg')) {
            return { title: stripGPG(file), key: newKey, path: getPath(pathUtil, firstPath, directoryPath, stripGPG(file)) }
          } else {
            return null
          }
        })
    )
    return objs.filter(obj => obj)
  }

  return loop(directoryPath, '')
}

function getPath(pathUtil, firstPath, directoryPath, file) {
  const newPath = directoryPath.substring(firstPath.length) + pathUtil.sep + file
  return newPath.startsWith('/') ? newPath.substring(1) : newPath
}

// We only pass files that end with .gpg to this function
function stripGPG(file) {
  const fileName = file.toString()
  return fileName.substring(0, fileName.length - 4)
}

exports.getFilesFromDirectory = getFilesFromDirectory
