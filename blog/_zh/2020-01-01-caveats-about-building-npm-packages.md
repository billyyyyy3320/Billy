---
title: 創建 npm package 的注意事項
date: 2020-01-01
tags:
  - Npm
  - JavaScript
summary: 我在製作npm package時犯的錯
comment:
  title: Caveats about building npm packages
---

繁體中文 | [English](/en/2020/01/01/caveats-about-building-npm-packages/)

新年第一天來回顧我去年製作 npm package 犯的傻事，以下將列出三點可能會對你有幫助的注意事項。

## 重複的 npm package

這是我在做[vuepress-plugin-disqus-comment](https://github.com/newsbielt703/vuepress-plugin-disqus-comment)遇到的傻事，這 plugin 一個開始的名字是`vuepress-plugin-disqus`。那時候我寫完時，很開心的按下`yarn publish`，卻在 Terminal 上看到：

`error Couldn't publish package: "https://registry.yarnpkg.com/vuepress-plugin-disqus: You do not have permission to publish \"vuepress-plugin-disqus\". Are you logged in as the correct user?"`

<img src="@assets/20200101/julia.jpg" width="500px" class="align-center">

愣住好一陣子後，才突然想到，趕快上[npmjs.com](https://www.npmjs.com/)收尋`vuepress-plugin-disqus`，果然：

![Duplicate plugin](@assets/20200101/duplicate-plugin.png)

早就有人做這個套件了...

奉勸各位開始埋頭苦幹前先上[npmjs.com](https://www.npmjs.com/)找找是不是已經有相關 package，也不是說已經有了就不能做，不過你可以衡量究竟是要發 PR 幫現有的 package 做改善，還是自己再造一個輪子。

## 善用 npm link

這是個更智障的傻事了。我在 package 裡寫了 demo，當然是直接載入本地的程式，如：`require("../../src/index"`，demo 都如我預期我就發佈了，當我用其他專案安裝這個 package 後才發現根本不能運作，打開 package.json 檢查：

```json
{
  "name": "vuepress-plugin-disqus-comment",
  "version": "0.2.0",
  "description": "Adding Disqus comments to VuePress",
  "keywords": ["comment", "disqus", "plugin", "vuepress"],
  "homepage": "https://vuepress-plugin-disqus.netlify.com",
  "bugs": {
    "url": "https://github.com/newsbielt703/vuepress-plugin-disqus/issues"
  },
  "repository": {
    "type": "git",
    "url": "newsbielt703/vuepress-plugin-disqus"
  },
  "license": "MIT",
  "author": "Billyyyyy3320 <newsbielt703@gmail.com>",
  "main": "index.js",
  "scripts": {
    "build:docs": "vuepress build docs --temp docs/.temp",
    "dev:docs": "vuepress dev docs --temp docs/.temp"
  },
  "dependencies": {
    "vue-disqus": "^3.0.5"
  },
  "devDependencies": {
    "vuepress": "^1.2.0",
    "vuepress-types": "^0.3.0"
  }
}
```

而這是我的目錄：

```shell
├── LICENSE
├── README.md
├── docs
│   └── README.md
├── package.json
├── src
│   ├── enhanceAppFile.js
│   └── index.js
└── yarn.lock
```

`main` 指定的位置根本不對啊！！

<img src="@assets/20200101/yelling.jpg" width="400px" class="align-center">

利用[npm link](https://docs.npmjs.com/cli/link) or [yarn link](https://yarnpkg.com/lang/en/docs/cli/link/) 可以將一個 package 連結至另一個專案，如果我當初有使用就會提早發現了。

你可能不會跟我一樣犯這種低級錯誤，但是至少記得發布前善用`npm link` or `yarn link`甚至[Yalc](https://github.com/whitecolor/yalc)來測試你的 package 是否正常。

## `.npmignore`

避免不需要的檔案被發布有三個方法，`.gitignore`或`.npmignore`或`package.json`裡的`file`屬性。

假設你的`.gitignore`長這樣：

```
node_modules
my_secret
```

那麼`node_modules`跟`my_secret`不只會被 git 忽略，也不會被 npm 上傳。

除非你的 package 裡有`.npmignore`，常見的像是你寫了測試，測試需要被 git 存儲，但是不需要被 npm 上傳，這時候你可就會用到`.npmignore`。你可能會寫成：

```
tests
```

那就慘囉`my_secret`會被上傳，只要有`.npmignore`，`.gitignore`就不會再被 npm 參考，所以確保你有列出所有不想被發布的檔案：

```
my_secret
tests
```

這點我沒有經歷切身之痛，是看到[這篇](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d)才去了解的，他很氣，很重要。

值得一提的是`node_modules`不需要寫在`.npmignore`裡，他會自動被忽視，詳情請見[npm](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package)。

## package 跟 module 差異

為了寫這篇 blog，我才知道 package 跟 module 差在哪裡:

簡單來說 package 需要有 `package.json` 來描述這個 package 的詳細資訊，而 module 可能只是個可以被載入的檔案或是目錄，不一定會有`package.json`，就像只有是哈士奇一定是狗，但是狗不一定是哈士奇，更多資訊請看[npm](https://docs.npmjs.com/about-packages-and-modules)。

新年快樂。
