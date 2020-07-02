const fs = require('fs-extra')
const path = require('path')
const AppDirectory = require('appdirectory')
const packageJson = require('../package.json')
const YAML = require('yaml')

class Config {
  constructor (options = {}) {
    const dirs = new AppDirectory({
      appName: packageJson.name,
    })
    this.path = options.path || path.resolve(dirs.userConfig(), 'config.yml')
    this.clear()
  }

  clear () {
    this.bookmarks = []
  }

  async load () {
    try {
      this.clear()
      const data = await fs.readFile(this.path, 'utf8')
      const conf = YAML.parse(data)
      this.bookmarks = conf.bookmarks
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }
  }

  async save () {
    const data = YAML.stringify({
      bookmarks: this.bookmarks,
    })
    await fs.mkdirp(path.dirname(this.path))
    await fs.writeFile(this.path, data)
  }
}
module.exports = Config
