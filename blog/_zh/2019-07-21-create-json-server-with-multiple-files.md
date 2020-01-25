---
title: 打造多檔案結構的json-server
date: 2019-07-21
tags:
  - JavaScript
summary: 有了json-server前端可以繼續開發不依賴後端，但是只有單一json檔案入口，維護太麻煩了，不如把它依照ＡＰＩ拆分成多個獨立檔案，讓開發更順手。
comment:
  title: Create json-server with multiple files
---

繁體中文 | [English](/en/2019/07/21/create-json-server-with-multiple-files/)

## 前言

先附上[範例](https://github.com/newsbielt703/json-server-mulitple-files-sample)

這篇文章只是分享我自己運用的方法，或許有更好的 Best practice 也說不定。

### `json-server` 能幹麻

先簡單看過 json-server 提供的 [Getting started](https://github.com/typicode/json-server#getting-started)：

Create a `db.json` file with some data

```
{
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 }
  ],
  "profile": { "name": "typicode" }
}
```

Start JSON Server

```
json-server --watch db.json
```

Now if you go to http://localhost:3000/posts/1, you'll get

```
{ "id": 1, "title": "json-server", "author": "typicode" }
```

就那麼簡單，但是實際專案中資料會更龐大複雜，需要更多 API 接口，於是我決定為每個 API 對應一個檔案。

## 開始

當下版本為 `"json-server": "^0.15.0"`

### 建立多檔案結構

建立新的資料夾`mock`，並在`package.json`寫個 script：

```json
"scripts": {
  "mock": "json-server --watch ./mock/db.js"
}
```

首先 db.json 可以改成 js 的格式：

```JavaScript
// db.js
// 必須是回傳一個return物件的function
module.exports = () => ({
  posts: [{ id: 1, title: "json-server", author: "typicode" }],
  comments: [{ id: 1, body: "some comment", postId: 1 }],
  profile: { name: "typicode" }
});
```

既然是 js，代表我們可以引入其他檔案：

```JavaScript
// db.js
const posts = require("./posts");
const comments = require("./comments");
const profile = require("./profile");
module.exports = () => ({
  posts,
  comments,
  profile
});
```

新建對應檔案 例如：

```JavaScript
// posts.js
module.exports = [{ id: 1, title: "json-server", author: "typicode" }];
```

### db.js 自動引入檔案

可以把資料拆分到多個不同檔案了，但是每次新增一個檔案都要引入一次，有夠麻煩。

這邊運用[glob](https://github.com/isaacs/node-glob)取出檔名，我們可以動態的引入檔案：

```JavaScript
// db.js
const Path = require("path");
const glob = require("glob");
const apiFiles = glob.sync(Path.resolve(__dirname, "./") + "/**/*.js", {
  nodir: true
});
// apiFiles會是
// [ '/Users/billy/Desktop/json-server-multiple-files-sample/mock/comments.js',
//   '/Users/billy/Desktop/json-server-multiple-files-sample/mock/db.js',
//   '/Users/billy/Desktop/json-server-multiple-files-sample/mock/posts.js',
//   '/Users/billy/Desktop/json-server-multiple-files-sample/mock/profile.js' ]

let data = {};

apiFiles.forEach(filePath => {
  const api = require(filePath);
  let [, url] = filePath.split("mock/"); // e.g. comments.js
  url = url.slice(0, url.length - 3)  // remove .js >> comments
  data[url] = api;
});

// data會是
// { 'comments': [ { id: 1, body: 'some comment', postId: 1 } ],
//   'db': {},
//   'posts': [ { id: 1, title: 'json-server', author: 'typicode' } ],
//   'profile': { name: 'typicode' } }

module.exports = () => {
  return data;
};
```

但是我不需要 db.js 也被拿去當 API 啊<br>
把`db.js`改名為`_db.js`，趁機改個規則 把所有開頭為`_`的檔案不視為 API 接口：

```JavaScript
// db.js
// ...
const apiFiles = glob.sync(Path.resolve(__dirname, "./") + "/**/[!_]*.js", {
// ...
```

### 監聽多檔案

json-server 只有在`_db.js`有更動時重啟，每當我新增 API，或修改回傳資料，我還得手動 `yarn mock`，好麻煩啊，
[解決方法](https://github.com/typicode/json-server/issues/434#issuecomment-273498639)：

```
yarn add -D nodemon
```

```json
"scripts": {
  "mock": "nodemon --watch mock --exec 'json-server ./mock/_db.js'"
}
```

### 更完整的 router

快要完成了，那 API 變得複雜點呢：

```
/blog/posts
/blog/comments
/blog/profile
/documents/query
```

我希望我的 mock 資料夾結構如下：

```
├── _db.js
├── blog
│   ├── comments.js
│   ├── posts.js
│   └── profile.js
└── documents
    └── query.js
```

動手修改`_db.js`規則：

```JavaScript
// db.js
const Path = require('path');
const glob = require('glob');
const config = require('./config.json');
const apiFiles = glob.sync(
  Path.resolve(__dirname, './') + '/**/[!_]*.js',
  {
    nodir: true,
  },
);

let data = {};


apiFiles.forEach(filePath => {
  const api = require(filePath);
  let [, url] = filePath.split('mock/');
  url = url.slice(0, url.length - 3);
  data[url.replace(/\//g, '-')] = api; // 只有這裡更動
});

// data會是
// { 'blog-comments': [ { id: 1, body: 'some comment', postId: 1 } ],
//   'blog-posts': [ { id: 1, title: 'json-server', author: 'tydpicode' } ],
//   'blog-profile': { name: 'typicode' },
//   'documents-query': { data: 123 } }

module.exports = () => {
  return data;
};
```

建立`config.json`和`router.json`：
（[config 配置](https://github.com/typicode/json-server#cli-usage)[router 配置](https://github.com/typicode/json-server#add-custom-routes)）

```json
// config.json
{
  "port": 9898,
  "routes": "./mock/router.json"
}
```

```json
// router.json
{
  "/*/*/*": "/$1-$2-$3",
  "/*/*": "/$1-$2"
}
```

這樣一來 `/documents/query` 就會對應到 `/documents-query`，<br>
如果有`/documents/query/something` 那就會對應到`/documents-query-something`，完全符合現在的資料夾結構了。

最後稍微修改一下：

```JavaScript
// _db.js
const Path = require("path");
const glob = require("glob");
const apiFiles = glob.sync(Path.resolve(__dirname, "./") + "/**/[!_]*.js", {
  nodir: true
});

let data = {};
apiFiles.forEach(filePath => {
  const api = require(filePath);
  let [, url] = filePath.split("mock/");
  url =
    url.slice(url.length - 9) === "/index.js"
      ? url.slice(0, url.length - 9) // remove /index.js
      : url.slice(0, url.length - 3); // remove .js
  data[url.replace(/\//g, "-")] = api;
});
module.exports = () => {
  return data;
};
```

萬一有個 API 是`/documents` 我就能把

```
├── _db.js
├── blog
│   ├── comments.js
│   ├── posts.js
│   └── profile.js
├── config.json
├── documents
│   └── query.js
├── documents.js
└── router.json
```

更條理的改成：

```
├── _db.js
├── blog
│   ├── comments.js
│   ├── posts.js
│   └── profile.js
├── config.json
├── documents
│   ├── index.js
│   └── query.js
└── router.json
```

## 其他

### 中文解碼

假使我有個 API 為`documents/基本`，我是訪問不到他的。<br>
`基本`會被編碼成`%E5%9F%BA%E6%9C%AC`，編碼規則是 ％加上十六進制，那就新增一個 middleware 來處理吧。<br>
每次收到 request 時都會經過 middleware，判斷 url 若包含編碼規則的字串，那就把 url 解碼。<br>
使用我前面預留的`_`作為檔名開頭:

```
├── _db.js
├── blog
│   ├── comments.js
│   ├── posts.js
│   └── profile.js
├── config.json
├── documents
│   ├── index.js
│   ├── query.js
│   └── 基本.js
├── middlewares
│   ├── _decodeChinese.js
└── router.json
```

```JavaScript
// _decodeChinese.js
module.exports = function(req, res, next) {
  const regex = /%(\d|[A-Z]){2}/;
  const isMatch = regex.test(req.url);
  if (isMatch) {
    req.url = decodeURI(req.url);
  }
  next();
};
```

```json
// config.json
{
  // ...
  "middlewares": ["./mock/middlewares/_decodeChinese.js"]
  // ...
}
```

### POST 轉成 GET

有時候會用 POST 來取得資料，但 json-server 提供的 custom route 都是 GET。
[解決方法](https://github.com/typicode/json-server/issues/453#issuecomment-343048811)<br>
一樣使用 middleware 處理，判斷 request 的方式為 POST 時就轉成 GET。

```JavaScript
// _postAsGet.js
module.exports = function(req, res, next) {
  if (req.method === 'POST') {
    // Converts POST to GET and move payload to query params
    // This way it will make JSON Server that it's GET request
    req.method = 'GET';
    req.query = req.body;
  }
  // Continue to JSON Server router
  next();
};
```

```json
// config.json
{
  // ...
  "middlewares": ["./mock/middlewares/_postAsGet.js"]
  // ...
}
```

### 同時運行 App 與 mock server 在一個 terminal

你可能覺得需要開兩個 terminal，一個 `yarn start` 一個 `yarn mock`。
其實很簡單 `yarn mock & yarn start` 就都會運行了，但就會發現分不出 log 是從那個 server 發出的。<br>
推薦使用[Concurrently](https://github.com/kimmobrunfeldt/concurrently)解決這件事：

```
yarn add -D concurrently
```

```json
"scripts": {
  "dev": "concurrently \"yarn:start\" \"yarn:mock\"",
}
```

---

End.
