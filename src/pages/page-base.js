const EventEmitter = require('events')

class PageBase extends EventEmitter {
  constructor (root) {
    super()
    this.root = root
    this.hide()
  }

  show () {
    this.root.show()
  }

  hide () {
    this.root.hide()
  }

  focus () {
    this.root.focus()
  }
}

module.exports = PageBase
