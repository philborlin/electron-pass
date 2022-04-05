export async function files() {
  if (window && window.dir) {
    return await window.dir()
  }

  return []
}

export async function pass(path) {
  if (window && window.pass) {
    return await window.pass(path)
  }

  return {}
}