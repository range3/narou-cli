# narou-cli
> 小説家になろうリーダー on Terminal

## 設定ファイル＆起動
```bash
$ vi ~/.config/narou-cli/config.yml
bookmarks:
  - n5519gi
  - n3289ds
  - n3930eh
  - n2710db

$ docker-compose build
$ docker-compose run --rm cli
```
or
```
$ npx narou-cli
```
or
```
$ npm -g install narou-cli
$ narou
```


## 操作方法
- 終了
  - `q`
- ブックマークページ
  - `b`
- 目次ページ
  - `m`
- リスト操作、スクロール操作
  - vimっぽいキーバーインドが使えます
  - `j` `k` `Enter`
- 前の話、次の話
  - `h` `l`
