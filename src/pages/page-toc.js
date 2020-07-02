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
      const selected = this.toc[i - 1]
      if (selected.type === 'episode') {
        this.emit('select',
          selected,
          this.toc.slice(0, i).filter(c => c.type === 'episode').length)
      }
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
        .map(c => {
          if (c.type === 'episode') {
            return [` ${c.subtitle || ''}`, c.created || '', c.updated || '']
          } else if (c.type === 'chapter') {
            return [c.title]
          }
        }),
    ])
  }
}

module.exports = PageToc
