async function getFilesFromDirectory(fs, path, directoryPath) {
  const loop = async (directoryPath, key) => {
    // const filesInDirectory = await fs.readdir(directoryPath)
    const filesInDirectory = fs.readdirSync(directoryPath)
    const objs =  await Promise.all(
      filesInDirectory.
        filter(file => !(/(^|\/)\.[^\/\.]/g).test(file)).
        map(async (file, index) => {
          const filePath = path.join(directoryPath, file)
          const newKey = key + index
          const stats = fs.statSync(filePath)

          if (stats.isDirectory()) {
            return { title: file, key: newKey, children: await loop(filePath, newKey + '-') }
          } else if (file.endsWith('.gpg')) {
            return { title: stripGPG(file), key: newKey }
          } else {
            return null
          }
        })
    )
    return objs.filter(obj => obj)
  }

  return loop(directoryPath, '')
}

// We only pass files that end with .gpg to this function
function stripGPG(file) {
  const fileName = file.toString()
  return fileName.substring(0, fileName.length - 4)
}

exports.getFilesFromDirectory = getFilesFromDirectory