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

* C/S DBMS型
* ファイル型
* SPA
* PWA

　本一冊分毎に一アプリとするか、著者の書いた作品すべて含めた著者毎に一アプリとするか。前者のほうが扱いやすいが、作品数だけアプリが重複してしまう。

* 作品毎に完結したアプリ
* アプリ固定で、任意作品をデータとする
* 著者毎に完結したアプリ

　読者としてはアプリ固定しつつ任意作品データを保持するのが好ましい。ただ、異なる著者の作品をどうやって探すかが課題。

