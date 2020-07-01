// const fs = require('fs')
const path = require('path')
const Narou = require('@range3/narou')
const blessed = require('neo-blessed')
const PageEpisode = require('./pages/page-episode')
const PageToc = require('./pages/page-toc')

// const text = fs.readFileSync(`${__dirname}/sample.txt`, { encoding: 'utf-8' })

// const episode = {
//   preface: '前書き1\n前書き2\nああああ',
//   content: text,
//   afterword: '後書き1\n後書き2\n後書き3',
// }

;(async () => {
  const ncodes = ['n5519gi', 'n3289ds', 'n3930eh', 'n2710db']
  const narou = new Narou()
  const novel = narou.novel(ncodes[process.argv[2] || 0])
  await novel.fetch()

  // console.log(novel.toc.toArray())
  // process.exit()

  // Create a screen object.
  const screen = blessed.screen({
    dump: path.resolve(__dirname, '../logs/test.log'),
    debug: true,
    warning: true,
    smartCSR: true,
    fullUnicode: true,
    title: 'Narou CLI',
  })

  const pageEpisode = new PageEpisode(screen, null, { wrap: true })
  const pageToc = new PageToc(screen, novel.toc.toArray())
  pageToc.show()
  pageToc.focus()

  let currentEpNo
  pageToc.on('select', (el, i) => {
    novel.episode(el.no).fetch().then((ep) => {
      currentEpNo = el.no
      pageToc.hide()
      pageEpisode.reset()
      pageEpisode.setEpisode(ep)
      pageEpisode.show()
      pageEpisode.focus()
      screen.render()
    }).catch((err) => {
      screen.debug(err)
    })
  })

  const openEpisodePage = (novel, eno) => {
    return novel.episode(eno).then((ep) => {
      pageEpisode.reset()
      pageEpisode.setEpisode(ep)
      screen.render()
    }).catch((err) => {
      screen.debug(err)
    })
  }

  pageEpisode.root.key('l', () => {
    openEpisodePage(novel, currentEpNo + 1).then(() => {
      currentEpNo += 1
    })
  })

  pageEpisode.root.key('h', () => {
    openEpisodePage(novel, currentEpNo - 1).then(() => {
      currentEpNo -= 1
    })
  })

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    screen.destroy()
    process.exit(0)
  })

  screen.key('m', () => {
    pageToc.show()
    pageToc.focus()
    screen.render()
  })

  // Focus our element.
  // episodeViewer.root.focus()

  // Render the screen.
  screen.render()
})()
  .catch(err => {
    console.log(err)
  })
