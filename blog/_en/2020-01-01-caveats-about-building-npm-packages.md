---
title: Caveats about building npm packages
date: 2020-01-01
tags:
  - Npm
  - JavaScript
summary: The dump things I've done when I was building npm packages
---

[繁體中文](/zh/2020/01/01/caveats-about-building-npm-packages/) | English

Let's review the dumb things I've done when I was building npm packages. Here're three caveats might help you.

## Duplicate npm package

It's the dump thing happened when I was writing [vuepress-plugin-disqus-comment](https://github.com/billyyyyy3320/vuepress-plugin-disqus-comment). The plugin name could've been `vuepress-plugin-disqus`. I pressed down `yarn publish` jovially when I finished. But looked at my terminal:

`error Couldn't publish package: "https://registry.yarnpkg.com/vuepress-plugin-disqus: You do not have permission to publish \"vuepress-plugin-disqus\". Are you logged in as the correct user?"`

<img src="@assets/20200101/julia.jpg" width="500px" class="align-center">

Stunned, but I figured it out eventually. I went to [npmjs.com](https://www.npmjs.com/) to search for `vuepress-plugin-disqus`, as I expected:

![Duplicate plugin](@assets/20200101/duplicate-plugin.png)

Someone's built this plugin...

Please head [npmjs.com](https://www.npmjs.com/) to check whether a relevant package is built before you start burying yourself in work.
I'm not telling you don't work on it, but you can at least consider whether making PRs to improve existed package or building another one from scratch.

## Leverage `npm link`

Well, this is a more stupid thing. I wrote demo which required local program in my package, such as `require("../../src/index"`. Since demo worked as I've expected, I published it. I'd just found out it can't work at all when I installed it to another project. Check `package.json`:

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

And here's my directory:

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

The path `main` indicated wasn't right at all !!

<img src="@assets/20200101/yelling.jpg" width="400px" class="align-center">

Leveraging [npm link](https://docs.npmjs.com/cli/link) or [yarn link](https://yarnpkg.com/lang/en/docs/cli/link/) can link a package into another project. I could've noticed that.

You may not make this low-level mistake, but remember to test you package with `npm link`, `yarn link` or even [Yalc](https://github.com/whitecolor/yalc) before publishing.

## `.npmignore`

There're three approaches to ignore files,`.gitignore`,`.npmignore` or the `file` property in `package.json`.

Suppose the `.gitignore` is something like:

```
node_modules
my_secret
```

`node_modules` and `my_secret` will be ignore not only by git but also by npm.

Unless there's `.npmignore` in your package. Let’s say you’ve written tests. Git should save the tests, whereas npm shouldn't upload them. You might want to use `.npmignore` in this case. If you write:

```
tests
```

Oops, `my_secret` will be upload. `.gitignore` won't be referenced when `.npmignore` exists, so make sure you've put all the files or dirs which you want to exclude into `.npmignore`:

```
my_secret
tests
```

It's a big deal. I got to know it because of [this article](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d).

It's worth to mention that you don't need to add `node_modules` to `.npmignore` since it'll be ignore automatically. Head [npm](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package) for more details.

## The difference between package and module

I only understand the difference because of writing this post:

In short, a package requires a `package.json` to describe it. A module can just be a file or dir which can be loaded by others, and don't require a `package.json`.
It's just like, a husky must be a dog, but a dog can be not a husky.

Head [npm](https://docs.npmjs.com/about-packages-and-modules) for more details.

Happy new year.
