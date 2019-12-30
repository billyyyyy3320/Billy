---
date: 2019-7-21
tag:
  - Frontend
  - JavaScript
summary: With json-server, Frontend engineers can develop without relying on Backend. But it's not handy to maintain it due to its single .json file entry. Why not splitting each API into separate files.
---

# Create `json-server` with multiple files

[繁體中文](/zh/2019/07/21/create-json-server-with-multiple-files/) | English

## Intro

[You can find a template here.](https://github.com/newsbielt703/json-server-mulitple-files-sample)

I'm going to share how I work with `json-server`, but perhaps there's another way you work more comfortable.

### What is `json-server`?

First, let's take a look at [json-server#getting-started](https://github.com/typicode/json-server#getting-started) :

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

It's pretty simple. However, the data might be more complicated in real world, so I'm going to create a file for each api.

## Starting

### Structure with multiple files

Create a new folder `mock`, and add a script in `package.json`:

```json
"scripts": {
  "mock": "json-server --watch ./mock/db.js"
}
```

First, transform `db.json` into `db.js`:

```JavaScript
// db.js
// Should export a function which return an object
module.exports = () => ({
  posts: [{ id: 1, title: "json-server", author: "typicode" }],
  comments: [{ id: 1, body: "some comment", postId: 1 }],
  profile: { name: "typicode" }
});
```

Since it's no longer a json file, you can load data from separate files:

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

Create corresponding files, for example:

```JavaScript
// posts.js
module.exports = [{ id: 1, title: "json-server", author: "typicode" }];
```

### Import files automatically

It's not very handy that you have to import the file whenever you create one.

Let's leverage [glob](https://github.com/isaacs/node-glob) to get file names so that we can load files dynamically:

```JavaScript
// db.js
const Path = require("path");
const glob = require("glob");
const apiFiles = glob.sync(Path.resolve(__dirname, "./") + "/**/*.js", {
  nodir: true
});
// apiFiles will be :
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

// data will be :
// { 'comments': [ { id: 1, body: 'some comment', postId: 1 } ],
//   'db': {},
//   'posts': [ { id: 1, title: 'json-server', author: 'typicode' } ],
//   'profile': { name: 'typicode' } }

module.exports = () => {
  return data;
};
```

But we don't need to load `db.js` to be a API, right?<br>
Rename `db.js > _db.js` and add a rule to prevent all files with `_` prefix from transforming API routes:

```JavaScript
// db.js
// ...
const apiFiles = glob.sync(Path.resolve(__dirname, "./") + "/**/[!_]*.js", {
// ...
```

### Monitor multiple files

Since json-server will automatically restart only when `_db.js` is changed, I have to do it whenever adding a API or modify data.
[Solution](https://github.com/typicode/json-server/issues/434#issuecomment-273498639):

```
yarn add -D nodemon
```

```json
"scripts": {
  "mock": "nodemon --watch mock --exec 'json-server ./mock/_db.js'"
}
```

### Better router

What if APIs become more complicated:

```
/blog/posts
/blog/comments
/blog/profile
/documents/query
```

I wish I can have the mock folder structure like below:

```
├── _db.js
├── blog
│   ├── comments.js
│   ├── posts.js
│   └── profile.js
└── documents
    └── query.js
```

Modify rules of `_db.js`:

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
  data[url.replace(/\//g, '-')] = api; // the only change
});

// data will be something like:
// { 'blog-comments': [ { id: 1, body: 'some comment', postId: 1 } ],
//   'blog-posts': [ { id: 1, title: 'json-server', author: 'tydpicode' } ],
//   'blog-profile': { name: 'typicode' },
//   'documents-query': { data: 123 } }

module.exports = () => {
  return data;
};
```

Create `config.json` and `router.json` files:
（[config usage](https://github.com/typicode/json-server#cli-usage)[router usage](https://github.com/typicode/json-server#add-custom-routes)）

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

Now `/documents/query` will correspond to `/documents-query`.<br>
If `/documents/query/something` is existed, it'll correspond to `/documents-query-something`. That's totally handle the folder structure.

Last modified:

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

Now if there's a API route `/documents`, I can restructure

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

to be something like：

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

## Others

### Decode Chinese characters

If there's a API route `documents/基本`, I won't be able to visit it.
`基本`will be encode to be`%E5%9F%BA%E6%9C%AC`. Since we know the encoded string is consisted of the percent character "%" followed by two hexadecimal digits, I can create a middleware to handle it. Use prefix `_` which I've reserved. Decode url when the url contains the encoded string:

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

### Get data using POST

Sometimes People have to get data by POST instead of GET, but `custom route` of `json-server` will always be GET.
[Solution](https://github.com/typicode/json-server/issues/453#issuecomment-343048811)<br>
Again `middleware`. To detect whenever the method is POST, transform it into GET.

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

### Run App and mock server at the same time in one terminal

It's kind of annoyed to open two terminal to run each server.
Actually, I can just run `yarn mock & yarn start`. But how do I know where logs come from ?<br>
I leverage [Concurrently](https://github.com/kimmobrunfeldt/concurrently) to solve this problem:

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
