# VanJSでJavelを作るときのvan.state()等を考える

## Javelアプリ構成

* Javel
    * Library
        * Manuscript
        * Loader
        * Viewer
        * Writer
    * Reader
    * Writer
    * Publisher
    * Printer
    * Replyer
    * Scopper

### Loader

　`Manuscript`を返す。

van.state|型|概要
---------|--|----
`text`|String|原稿（テキストデータ）
`url`|String|原稿（`fetch()`）
`file`|File|原稿（DnD, input type=file, FileSystemAPI）
`uuid`|String|原稿（IndexedDB内にある原稿データを取得する）
`dom`|Element|原稿（`pre`,`textarea`要素から原稿を取得する）
`path`|String|原稿（Node.js限定でパス文字列から原稿ファイルを取得する）

```js
javel.lib.loader.text = 原稿（Stringデータ）
javel.lib.loader.url = 原稿（Stringデータ（https://...））
javel.lib.loader.file = 原稿（Fileオブジェクト（DnD, input type=file, FileSystemAPI））
javel.lib.loader.uuid = 原稿（Stringデータ。IndexedDB内にある原稿データを取得する）
javel.lib.loader.dom = 原稿（Element。`pre`,`textarea`要素から原稿を取得する）
javel.lib.loader.path = 原稿（Stringデータ。Node.js限定でパス文字列から原稿ファイルを取得する）
```

　値を代入したら各方法で原稿テキストを取得して`Manuscript`を作成する。

### Viewer

　`Manuscript`を表示するUIを作成する。

van.state|型|概要
---------|--|----
`manuscript`|`Manuscript`|原稿
`blockSize`|int|画面のブロック方向サイズ
`inlineSize`|int|画面のインライン方向サイズ
`columnCount`|int|画面分割数（1,2,auto）
`lineOfChars`|int|一行あたりの表示文字数（日本語では40字が最適。スマホは20字が限界。16px/字が最小）
`padding`|int|画面と本文間の余白（CSS:`padding-[block|inline]-[start|end]:?em;`, `box-sizing:border-box;`）
`writingMode`|String|書字方向（`horizontal-tb`/`vartical-rl`）
`colorScheme`|String|配色（`light`/`dark`）
`showMenuMethod`|string|メニュー表示方法（`Fixed.[block|inline][First|Last|Middle]`, `longPress.show[Menu|Dialog]`）

### Writer

van.state|型|概要
---------|--|----
`text`|String|原稿（テキストデータ）
`manuscript`|`Manuscript`|原稿
`manuscript.Meta`|`Manuscript.Meta`|原稿メタデータ
`manuscript.Meta.title`|`Manuscript.Meta.title`|原稿タイトル
`manuscript.Meta......`|`Manuscript.Meta......`|原稿メタデータ
`manuscript.Body`|`Manuscript.Body`|原稿本文
`manuscript.Body.Block`|`Manuscript.Body.Block`|原稿本文内ブロック

* `Meta.uuid`があるならIndexedDBに保存する
* `Meta.repoUrl`があるならGitHubへpushする
* `Meta._domTo`があるならDOMへ代入する
* `Meta._download`があるならファイル化してダウンロードする
* `Meta._clickboardCopy`があるならクリップボードへコピーする
* `Meta._fsaWrite`があるならFileSystemAPIで書き込む

### Manuscript

　原稿。本インスタンスはプロセス単位でひとつのみ。loaderで読み込むたびに更新される。

van.state|型|概要
---------|--|----
`Meta`|Object|本のメタデータ（タイトル等）
`Body`|Object|本の本文（見出しや本文等）

van.state|型|概要
---------|--|----
`Meta.title`|string|本のタイトル
`Meta.subTitle`|string|本のサブタイトル
`Meta.catch`|string|本のキャッチコピー
`Meta.intro`|string|本の紹介文（キャッチコピーの詳細）
`Meta.genres`|string[]|本のジャンル
`Meta.selfRatings`|string[]|本のセルフレイティング（性描写あり、暴力描写あり、残虐描写あり等）
`Meta.url`|string|本のURL
`Meta.uuid`|string|本のUUID
`Meta.revisions`|object[]|本のリビジョン（`[{id:0, date:yyyy-MM-ddTHH:MM:SS, patch:(diff,patchコマンド値), summary:''}, ...]`）
`Meta.fileSize`|int|本のファイルサイズ(B)
`Meta.charCount`|int|本の文字数（YAML[含む|なし]、メタ字[含む|なし]、ルビ文字[含む|なし]、空白文字[含む|なし]）
`Meta.author.name`|string|著者名
`Meta.author.url`|string|著者サイトURL
`Meta.author.linkTo`|object|著者SNS等URL（`{github:'https://...', twitter:'https://...'}`）
`Meta.pushTo`|object|アップロード先（`{github:'https://...'}`）
`Meta.donateTo`|object|寄付先（`{monacoin:address, bitcoin:address, ...}`）
`Meta.pullReqTo`|object|プルリク先（`{github:https://...}`）
`Meta.replyTo`|object|返信先（`{mastdon-instanceA:https://..., misskey-instanceA::https:///...}`）

van.state|型|概要
---------|--|----
`Body.text`|string|本の本文（テキストブロックの全文）
`Body.blocks`|string[]|本の本文（テキストブロック単位の配列）
`Body.html`|object|テキストブロックの位置とHTML。HTMLは画面サイズに収まる範囲（`{blockIndexStart:0, blockIndexEnd:0, html:''}`）
`Body.htmls`|objects[]|テキストブロック単位のHTML

van.state|型|概要
---------|--|----
`Body.searchs`|object|ルビがあっても期待するようなテキスト検索をするためのデータ（`{blockIndexStart:0, blockIndexEnd:0, rubyBaseText:'親文字だけ含みルビを消した版', rubyText:'親文字を消してルビのみ含めた版'}`）
`Body.talks`|object|音声合成用データ（`{blockIndexStart:0, blockIndexEnd:0, engine:{'aquesTalk':'AquesTalk用', openJTalk:'OpenJTalk版', ...}`）

## 要素

* Screen
	* Page
	* Menu

### 詳細

* Screen
	* Page
		* Manuscript
			* Meta
				* Yaml : object
				* Html : object
			* Body
				* Text : string
				* Blocks : [string]
				* Htmls : [width-height-writingMode][string]
			* Command
				* load(url/uuid/text)
				* download()
				* export()
				* import(url/text)
		* Command
			* next()
			* prev()
			* open(page/url/params)
			* getSelectedLink()
	* Menu
		* Loading
		* Noble
		* NowTime
		* Summary
		* WritingMode
		* ColorScheme
		* FullScreen
		* Setting

# reactive state

* van.state()
	* manuscript
		* text : load()
		* state : loading/loaded
	* screen
		* blockSize : remake(), resize()
		* inlineSize : remake(), resize()
		* writingMode : remake(), resize()
		* colorScheme : setColorScheme()
		* fullScreen : requestFullscreen()
		* nowTime : alert()
		* state : loading/loaded
        * num : innerScreenNum(1/2/他(自動), single/double/auto/他(auto))
        * lineOfChars : (20〜50(他のとき自動), font-size:16px以上保障)
    * menu
        * position : top/bottom/left/right, blockPosFirst/blockPosLast/inlinePosFirst/inlinePosLast
        * showable: always, longPressPopup, doublePressPopup
	* page
		* now : next(), prev(), open(page/url/params)
		* all : 
		* state : loading/loaded
```
const { screen, menu, page } = javel.parts
javel.init()

manuscript.text = await fetch('https://原稿.txt')

screen.blockSize = clientBlockSize()
screen.inlineSize = clientInlineSize()
screen.writingMode = 'vertical'
screen.colorScheme = 'light'
screen.isFullScreen = false
screen.num = 'auto'
screen.lineOfChars = 'auto'

menu.position = 'blockPosLast'
menu.showable = 'always'

page.now++
page.now--
page.now = 7
page.now += 3
page.now = {blockIndex:53, innerBlockIndex:2, text:'指定位置にあるブロック内テキストノード内の対象テキスト'}
page.now = {blockIndex:[53, 53], innerBlockIndex:[2, 4], text:['開始テキスト', '終了テキスト']}
page.now = 'b=53&ib=2&t=xxxxx'
page.now = `#:~:text=[prefix-,]textStart[,textEnd][,-suffix]`
```

# text-fragment-generator

* https://stackoverflow.com/questions/76369701/how-to-generate-text-fragment-for-selected-text
* https://developer.mozilla.org/ja/docs/Web/Text_fragments
* https://web.dev/articles/text-fragments?hl=ja
* https://unpkg.com/browse/text-fragments-polyfill@5.5.0/dist/
* https://unpkg.com/browse/text-fragments-polyfill@5.5.0/dist/fragment-generation-utils.js
* https://unpkg.com/text-fragments-polyfill@5.5.0/dist/fragment-generation-utils.js

```js
const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
const result = generateFragment(window.getSelection());
if (result.status === 0) {
  let url = `${location.origin}${location.pathname}${location.search}`;
  const fragment = result.fragment;
  const prefix = fragment.prefix ?
    `${encodeURIComponent(fragment.prefix)}-,` :
    '';
  const suffix = fragment.suffix ?
    `,-${encodeURIComponent(fragment.suffix)}` :
    '';
  const start = encodeURIComponent(fragment.textStart);
  const end = fragment.textEnd ?
    `,${encodeURIComponent(fragment.textEnd)}` :
    '';
  url += `#:~:text=${prefix}${start}${end}${suffix}`;
  console.log(url);
}
```

