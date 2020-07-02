// const fs = require('fs')
const path = require('path')
const Narou = require('@range3/narou')
const blessed = require('neo-blessed')
const PageEpisode = require('./pages/page-episode')
const PageToc = require('./pages/page-toc')
const PageBookmarks = require('./pages/page-bookmarks')
const Config = require('./config')

;(async () => {
  // Create a screen object.
  const screen = blessed.screen({
    dump: path.resolve(__dirname, '../logs/test.log'),
    debug: true,
    warning: true,
    smartCSR: true,
    fullUnicode: true,
    title: 'Narou CLI',
  })

  try {
    const config = new Config()
    await config.load()
    const narou = new Narou()

    const pageEpisode = new PageEpisode(screen, null, { wrap: true })
    const pageToc = new PageToc(screen)
    const pageBookmarks = new PageBookmarks(screen)

    const novels = await narou.getNovels(config.bookmarks)

    novels.sort((a, b) =>
      Date.parse(b.metadata.novelupdated_at) -
      Date.parse(a.metadata.novelupdated_at))

    pageBookmarks.setData(novels)
    pageBookmarks.show()
    pageBookmarks.focus()

    let currentNovel = narou.novel(config.bookmarks[process.argv[2] || 0])
    pageBookmarks.on('select', (novel, i) => {
      currentNovel = novel
      currentNovel.fetch()
        .then(novel => {
          pageBookmarks.hide()
          pageToc.setData(novel.toc.toArray())
          pageToc.show()
          pageToc.focus()
          screen.render()
        })
        .catch(err => screen.debug(err.message))
    })

    let currentEpNo
    pageToc.on('select', (el, i) => {
      currentNovel.episode(el.no).fetch().then((ep) => {
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
      return novel.episode(eno).fetch().then((ep) => {
        pageEpisode.reset()
        pageEpisode.setEpisode(ep)
        screen.render()
      }).catch((err) => {
        screen.debug(err)
      })
    }

    pageEpisode.root.key('l', () => {
      if (currentEpNo < currentNovel.episodeLength) {
        openEpisodePage(currentNovel, currentEpNo + 1).then(() => {
          currentEpNo += 1
        })
      }
    })

    pageEpisode.root.key('h', () => {
      if (currentEpNo > 1) {
        openEpisodePage(currentNovel, currentEpNo - 1).then(() => {
          currentEpNo -= 1
        })
      }
    })

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], (ch, key) => {
      config.save()
        .finally(() => {
          screen.destroy()
          process.exit(0)
        })
    })

    screen.key('m', () => {
      pageToc.show()
      pageToc.focus()
      screen.render()
    })

    screen.key('b', () => {
      pageToc.hide()
      pageEpisode.hide()
      pageBookmarks.show()
      pageBookmarks.focus()
      screen.render()
    })

    // Focus our element.
    // episodeViewer.root.focus()

    // Render the screen.
    screen.render()
  } catch (err) {
    screen.debug(err.message)
    throw err
  }
})()
  .catch(err => {
    console.err(err)
  })
