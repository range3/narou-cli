const blessed = require('neo-blessed')
const PageBase = require('./page-base')
const JpWrap = require('jp-wrap').JpWrap

class PageEpisode extends PageBase {
  constructor (screen, episode, options = {}) {
    super(blessed.box({
      parent: screen,
      scrollable: true,
      alwaysScroll: true,
      mouse: true,
      keys: true,
      vi: true,
    }))

    this.options = {
      wrap: true,
      wrapLength: 72,
      ...options,
    }

    const jpWrap = new JpWrap(this.options.wrapLength, {
      trim: false,
      fullWidthSpace: false,
    })

    this.options.wrap
      ? this.wrap = s => jpWrap.wrap(s || ' ').join('\n')
      : this.wrap = s => s

    this.root.key('space', () => {
      this.root.scroll(this.root.height, true)
      this.root.screen.render()
    })

    this.subtitle = blessed.box({
      parent: this.root,
      content: this.wrap(episode?.subtitle),
      width: '100%',
    })

    this.preface = blessed.box({
      parent: this.root,
      content: this.wrap(episode?.preface),
      width: '100%',
    })

    this.content = blessed.box({
      parent: this.root,
      content: this.wrap(episode?.content),
      width: '100%',
    })

    this.afterword = blessed.box({
      parent: this.root,
      content: this.wrap(episode?.afterword),
      width: '100%',
    })

    if (episode) {
      this.calcBoxPosition()
    }
  }

  _wrappedString (s) {
    return this.wrap(s || ' ')
  }

  reset () {
    this.root.resetScroll()
  }

  setEpisode (ep) {
    this.subtitle.setText(this.wrap(ep.subtitle))
    this.preface.setText(this.wrap(ep.preface))
    this.content.setText(this.wrap(ep.content))
    this.afterword.setText(this.wrap(ep.afterword))

    this.calcBoxPosition()
  }

  calcBoxPosition () {
    this.subtitle.top = 0
    this.subtitle.height = this.subtitle.getScreenLines().length

    this.preface.top = this.subtitle.top + this.subtitle.height + 1

    if (this.preface.getText()) {
      this.preface.height = this.preface.getScreenLines().length
      this.content.top = this.preface.top + this.preface.height + 1
    } else {
      this.preface.height = 0
      this.content.top = this.preface.top
    }
    this.content.height = this.content.getScreenLines().length
    this.afterword.height = this.afterword.getScreenLines().length
    this.afterword.top = this.content.top + this.content.height + 1
  }
}

module.exports = PageEpisode
