// Returns { stdout, stderr }
async function pass(exec, path) {
  return await exec(`pass ${path}`)
}

exports.pass = pass