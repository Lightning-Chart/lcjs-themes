const fs = require('fs')
const path = require('path')
// Edit node_modules/@arction/lcjs-themes package.json version to be something random
// otherwise React seems to use some old version from cache (if build was remade but version is still marked same)

const pathPackageJson = path.resolve('node_modules', '@arction', 'lcjs-themes', 'package.json')
const file = JSON.parse(fs.readFileSync(pathPackageJson))
const version = `${Math.round(Math.random() * 1_000_000)}.0.0`
file.version = version
fs.writeFileSync(pathPackageJson, JSON.stringify(file))
