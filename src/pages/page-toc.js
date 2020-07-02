const blessed = require('neo-blessed')
const PageBase = require('./page-base')

class PageToc extends PageBase {
  constructor (screen, toc = []) {
    super(blessed.box({
      parent: screen,
    }))

    this.table = blessed.listtable({
      parent: this.root,
      align: 'left',
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

    this.setData(toc)

    this.table.on('select', (el, i) => {
      this.emit('select', this.toc.filter(c => c.type === 'episode')[i - 1], i - 1)
    })
  }

  focus () {
    this.table.focus()
  }

  setData (toc) {
    this.toc = toc
    this.table.setData([
      ['Subtitle', 'Created', 'Updated'],
      ...toc
        .filter(c => c.type === 'episode')
        .map(c => {
          return [c.subtitle || '', c.created || '', c.updated || '']
        }),
    ])
  }
}

module.exports = PageToc
