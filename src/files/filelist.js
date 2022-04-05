export async function files() {
  if (window && window.dir) {
    return await window.dir()
  }

  return []
}