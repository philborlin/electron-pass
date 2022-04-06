export async function files() {
  if (window && window.dir) {
    return await window.dir()
  }

  return []
}

export function filterFiles(search, files) {
  return files.filter(file => {
    if (file.children) {
      const adjusted = filterFiles(search, file.children)
      file.children = adjusted
      return adjusted.length > 0
    }
    return file.title.toLowerCase().includes(search.toLowerCase())
  })
}

export function getAllKeys(files) {
  return files.flatMap(file => {
    if (file.children) {
      return [file.key, ...getAllKeys(file.children)]
    }
    return file.key
  })
}

export async function pass(path) {
  if (window && window.pass) {
    return await window.pass(path)
  }

  return {}
}