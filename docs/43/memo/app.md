# アプリ構造（Application Architecture）

```
javel
           book
  reader  replyer writer
  shelf           desk
  printer scopper publisher
```

語|概要
--|----
`javel`|アプリ名。`Japanese`と`Novel`を合わせた造語。`Javelin`は投げ槍のこと。
`book`|原稿。本のタイトルや本文が記されたテキストファイル。
`reader`|`book`を元に本のように表示し読めるアプリ。
`writer`|`book`を作成するアプリ。
`shelf`|`reader`で読んだ本のログ保存するアプリ。
`desk`|`writer`で作成した本のログ保存するアプリ。
`printer`|`book`を印刷するアプリ。
`publisher`|`book`を公開するサイトを作成するアプリ。
`replyer`|読者が著者に返信するアプリ。感想、指摘、寄付などのログ保存するアプリ。SNS発信、GitHubプルリク等。
`scopper`|他者の作品をネットから見つけて面白いよと宣伝するアプリ。

## ユースケース

### 著者

app|do
---|--
`writer`|本を書く
`desk`|書いた本を管理する
`publisher`|本を公開する
`printer`|本を印刷する

### 読者

app|do
---|--
`reader`|本を読む
`shelf`|読んだ本を管理する
`replyer`|読んだ本に返信する
`printer`|本を印刷する

## 開発優先度

1. `reader`
2. `writer`
3. `publisher`
4. `replyer`
5. `printer`

## 詳細

### reader

* ファイル・プロトコル (file:///)
* C/S DBMS型
* SPA (C/S Client)
* PWA (Offline Browser App)

　本一冊分毎に一アプリとするか、著者の書いた作品すべて含めた著者毎に一アプリとするか。前者のほうが扱いやすいが、作品数だけアプリが重複してしまう。

* 作品毎に完結したアプリ
* アプリ固定で、任意作品をデータとする
* 著者毎に完結したアプリ

　読者としてはアプリ固定しつつ任意作品データを保持するのが好ましい。ただ、異なる著者の作品をどうやって探すかが課題。

形式|offline|HTTPS JS API
----|-------|------------
FILE|○|✖
C/S|✖|○
SPA|✖|○
PWA|○|△

　PWAが最も幅広く動作サポートする。ただ、ドメイン単位でOfflineデータ保存するのがネック。ふつうドメインは著者単位である。そのせいで著者が違うと同じアプリデータが重複して保存されてしまう。なのでアプリ著者がアプリをドメイン公開し、そのアプリではURLで原稿ファイルを読み込めるようにするなど、外部から原稿を受け付ける工夫がいる。理想を言えば原稿ファイルをアプリから検索したい。このインデックス情報をどう作成し、どう公開・取得するか。SNSやWebMentionを活用すれば可能かもしれないが、自動化アプリは難しそう。GitHubのCIなら可能だが制約がある。そもそも膨大な量になってしまう。Google検索のように外部に丸投げしたい。

　FILEプロトコルで動作するものが最も簡単に作成できるはず。ただ、HTTPS上でしか動作しないfetch APIなどが使えない。原稿などすべてHTMLファイルに含めるので編集しづらい。localStorageは使えるので栞は作れる。よって基本的には修正しない完成されたファイルである。

　ダウンロードするときは以下の３パターンになる。

1. 原稿ファイルのみ（テキストファイル）
2. SQLite3ファイルのみ（原稿データ複数包含）
3. FILE版アプリ＆原稿（HTMLファイル）
4. PWA版アプリ＆原稿（HTML,CSS,JS,Font,...）
5. EPUB（ZIP（XHTML,CSS,png,...））

　原稿ファイルはFILE／PWAアプリ両方で参照可能。FILE版は特定作品とアプリが一体化している。PWA版は作品がIndexedDBになる。外部から原稿ファイルをURLやD&Dで参照してDBに登録する。その歳、DB登録しない／する（URLのみ／全データ）の３通りを選べる。IndexedDBは2GB上限があるので、URLのみにすると節約できる。ただしオフラインで閲覧できない。
　2GBは一冊あたり10万字300KBとすると6666冊分。URLひとつ128Bなら15625000冊分。人生のうち60年で毎日二時間読書する想定で、一分400字読むと、一日二時間48000字、一年365日17520000字、60年1051200000字。一冊10万字なら10512冊読める。6666冊だと少し足りないが3割ほどURL化すれば保存可能。GoogleBooksによると世界に存在する全本は1億2986万4880冊。人が一生に読めるのは一万冊。

　これに加えてSQLite3ファイルを追加してもよい。著者単位で複数作品をひとつに含めたもの。集計もできる。だが単体ではテキストエディタでの参照もできない。

　PWAは直接外部ファイル参照できない。セキュリティ上の制約があるため。FileSystemAPIはChromeに限り使えるがユーザ操作による許可が必要のため自動化できない。IndexedDBやFileAPIなどはドメイン単位で保存され、上限2GB制約がある。1TBのような大容量の原稿ファイルを管理できない。

　電子本の国際規格EPUBに変換できるようにする。

#### 

* ファイル・プロトコル (file:///)
* C/S DBMS型
* SPA (C/S Client)
* PWA (Offline Browser App)
* EPUB

# アプリ名

候補|概要
----|----
`javel`|`Japanese`,`Novel`,`Javelin`,`Javelon`(`Avalon`) アイコンは`日`を90度横に倒して本を開いた形📖にする。内側は白、枠線は赤。国旗の色
`ovel`|`Open-Novel`
`f-book`|`Flex(Flow)`,`Book`, `E-Book`の次（`E`の次のアルファベットは`F`。XHTML製EBook規格は古いし非レスポンシブ。ただ、`G-Book(GoogleBooks)`があるので微妙か。さすがに`H-Book`はちょっと…H本…。`I-Book`だとI本IPhoneみたいだし。`J-Book`のほうがいいかも？ Japan。`P-Book`でPersonal`もよさげ？　`O-Book`でオレオレ本？ Open-Book？。`R-Book`でレスポンシブ本。`T-Book`でText本）


```
https://domain.co.jp/javel-reader.html?f=uuid&b=3
https://domain.co.jp/javel-writer.html?f=uuid&b=3
```

　IndexedDBに登録するとき、本のURLを渡す。これを受けてアプリは登録する。

```
https://domain.co.jp/javel-reader.html?regist=https://...
```

