const blessed = require('neo-blessed')
const PageBase = require('./page-base')

class PageBookmarks extends PageBase {
  constructor (screen, novels = []) {
    super(blessed.box({
      parent: screen,
    }))

    this.table = blessed.listtable({
      parent: this.root,
      width: '100%',
      keys: true,
      vi: true,
      mouse: true,
      style: {
        header: {
          bold: true,
        },
        cell: {
          selected: {
            bg: 'red',
          },
        },
      },
      scrollbar: {
        bg: 'white',
        ch: ' ',
      },
    })

    this.setData(novels)

    this.table.on('select', (el, i) => {
      this.emit('select', this.novels[i - 1], i - 1)
    })
  }

  focus () {
    this.table.focus()
  }

  setData (novels) {
    this.novels = novels
    this.table.setData([
      ['ncode'],
      ...novels
        .map(novel => {
          return [novel.ncode]
        }),
    ])
  }
}

module.exports = PageBookmarks
