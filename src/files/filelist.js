export async function files() {
  return await dir()
  // return toTree(await dir())
}

async function dir() {
  if (window && window.dir) {
    return window.dir()
  }

  return []
}

export function toTree(allFiles) {
  return toTreeIndexed(allFiles, '')
}

export function toTreeIndexed(allFiles, key) {
  return allFiles.
    map((file, index) => {
      const newKey = key + index

      if (Array.isArray(file)) {
        return { title: dirName(file), key: newKey, children: toTreeIndexed(file, newKey + '-') }
      } else {
        return { title: stripPath(file), key: newKey }
      }
    })
}

function stripPath(file) {
  const fileName = file.toString()
  return fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length - 4)
}

function dirName(dir) {
  const s = dir[0].toString().split('/')
  return s[s.length - 2]
}