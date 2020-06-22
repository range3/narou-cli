const blessed = require('neo-blessed')
const PageBase = require('./page-base')

class PageToc extends PageBase {
  constructor (screen, toc) {
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

    this.table.on('select', (el, i) => {
      this.emit('select', toc.filter(c => c.type === 'episode')[i - 1], i - 1)
    })

    this.table.setData([
      ['Subtitle', 'Created', 'Updated'],
      ...toc
        .filter(c => c.type === 'episode')
        .map(c => {
          return [c.subtitle || '', c.created || '', c.updated || '']
        }),
    ])
  }

  focus () {
    this.table.focus()
  }
}

module.exports = PageToc
