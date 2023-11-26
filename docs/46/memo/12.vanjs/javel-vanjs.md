# VanJSでJavelを作るときのvan.state()等を考える

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

