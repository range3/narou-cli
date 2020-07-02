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
      scrollbar: {
        bg: 'white',
        ch: ' ',
      },
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
      width: '100%-1',
    })

    this.preface = blessed.box({
      parent: this.root,
      content: this.wrap(episode?.preface),
      width: '100%-1',
    })

    this.content = blessed.box({
      parent: this.root,
      content: this.wrap(episode?.content),
      width: '100%-1',
    })

    this.afterword = blessed.box({
      parent: this.root,
      content: this.wrap(episode?.afterword),
      width: '100%-1',
    })

    this.line1 = blessed.line({
      parent: this.root,
      width: '100%-1',
      orientation: 'horizontal',
    })

    this.line2 = blessed.line({
      parent: this.root,
      width: '100%-1',
      orientation: 'horizontal',
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
      this.line1.top = this.preface.top + this.preface.height
      this.content.top = this.line1.top + 1
    } else {
      this.line1.hide()
      this.preface.height = 0
      this.content.top = this.preface.top
    }
    this.content.height = this.content.getScreenLines().length
    this.line2.top = this.content.top + this.content.height
    this.afterword.top = this.line2.top + 1
    this.afterword.height = this.afterword.getScreenLines().length
    if (!this.afterword.getText()) {
      this.line2.hide()
    }
  }
}

module.exports = PageEpisode
