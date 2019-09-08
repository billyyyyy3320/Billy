---
layout: PostWithDiagram
date: 2019-9-8
tag:
  - Vue
  - VuePress
  - Frontend
  - JavaScript
---

# Dive into VuePress with Plugin APIs

## Plugin ???

The most important change in VuePress 1.x is `Pluggable`. VuePress has a lot of core functions implemented by plugins, and offers many [options](https://v1.vuepress.vuejs.org/plugin/option-api.html) for developer to build their plugins. Moreover, `.vuepress/config.js` and `theme/index.js` are also plugins.

It flashed on my mind that if I figure out the execution sequence of all the plugin APIs and what is really executed, maybe it's a special approach to understand the ins and outs of how VuePress works.

### Warm up

First, let's check out all the plugin options:

```json
// hooks
ready
generated
// options
chainWebpack
extendMarkdown
chainMarkdown
enhanceAppFiles
extendPageData
clientDynamicModules
clientRootMixin
additionalPages
globalUIComponents
define
alias
extendCli
beforeDevServer
afterDevServer
```

I've created a diagram to show the whole life-cycle. There's a switch button at header. You can simply click it and the diagram might show up. Note that it is scrollable. Hope it will be a useful reference.

### How do plugins work

All the plugin options will be in initialized at the beginning. They all have their own class. You can take a look at `@vuepress/core/lib/node/plugin-api/abstract`. Later, whenever VuePress get the plugin config, it'll push them into each corresponding option. And at the timing you saw in my diagram, they will be executed.

## Prepare

We all know VuePress can be started by `vuepress dev` or `vuepress build`. No matter triggered by which one, it has to enter this process. (Btw, I call it `Prepare` because the function which handle this process in VuePress 0.x is named `prepare`)

### Markdown

Suppose you have already known VuePress uses [Markdown-it](https://github.com/markdown-it/markdown-it) as the Markdown renderer.

The first two APIs in the life-cycle are:

- `chainMarkdown`

> Edit the internal Markdown config with markdown-it-chain —— A chaining API like webpack-chain but for markdown-it.

- `extendMarkdown`

> A function to edit default config or apply extra plugins to the markdown-it instance used to render source files.

First, VuePress has to create markdown config. VuePress leverages [markdown-it-chain](https://github.com/ulivz/markdown-it-chain) which is developed directly on the basis of webpack-chain. In the config, VuePress will add a bunch of markdown-it plugins (most of them is created by VuePress).

Then, VuePress is going to run the plugin API `chainMarkdown` which is going to config markdown-it as the same way above. After markdown-it-chain created a markdown-it instance with all the above configuration, VuePress starts to run `extendMarkdown`.

Those impressive features about writing Markdown might be accomplished here, such as `Custom Containers` which offers shortcuts to create beautiful UI components, `Internal Links` converted to `<router-link>` for SPA navigation, [etc](https://v1.vuepress.vuejs.org/guide/markdown.html).

### Pages

The next APIs I'm going to talk about are:

- `extendPageData`

> A function used to extend or edit the \$page object. This function will be invoking once for each page at compile time.

- `additionalPages`

> Add a page pointing to a Markdown file.

Finding all page source files located in sourceDir, VuePress is going to resolve them. It generates the page title and headers, resolves frontmatters, and so on. This information is saved for rendering later.

VuePress will run `extendPageData` after each page is processed. After all of that, It's time to run `additionalPages`. The pages added by `additionalPages` will be resolve as the same way, so `extendPageData` will also be invoked.

### Ready

There're five options in this section:

- `ready`

> The ready hook is executed after the application is initialized and before some specific functional APIs are executed.

- `clientDynamicModules`

> Generate some client modules at compile time.

- `clientRootMixin`

> A path to the mixin file which allows you to control the lifecycle of root component.

- `enhanceAppFiles`

> This option accepts absolute file path(s) pointing to the enhancement file(s), or a function that returns the path(s), which allows you to do some App Level Enhancements.

- `globalUIComponents`

> You might want to inject some global UI fixed somewhere on the page.

VuePress will run `ready` after pages are resolved. You might be interested to know [styling](https://v1.vuepress.vuejs.org/config/#styling) is completed by an internal plugin which leverages `ready`.

Next, run `clientDynamicModules` the option used most often by internal plugins. That's why we can access [Global Computed](https://v1.vuepress.vuejs.org/guide/global-computed.html#global-computed), use SPA navigation without manual configuration of Vue router paths and how page components or layout components be imported. Moreover, the following option `clientRootMixin` is also handled by `clientDynamicModules`. It'll generate some temp files so that VuePress client can use them. You can simply open `@vuepress/core/.temp` and check it out.

`enhanceAppFiles` and `globalUIComponents` are processed by a similar way. VuePress client will do some App Level Enhancements and register those UI components by the temp files generated by them.

The next following things VuePress will do depends on which command you actually run.

## Custom commands

- `extendCli`

> Register a extra command to enhance the CLI of VuePress. The function will be called with a [CAC](https://github.com/cacjs/cac)'s instance as the first argument.

VuePress leverages [CAC](https://github.com/cacjs/cac) to build its Command-line Interface. Before CAC parses the arguments, VuePress will check node version, register [core commands](https://v1.vuepress.vuejs.org/api/cli.html#command-line-interface) and handle unknown commands which is included your custom command.

Note that you have to tell VuePress where's your source files, e.g. `vuepress hello docs`. VuePress has to run all I've just mentioned [earlier](#prepare), otherwise it can't access `extendCli`.

## Dev

### Create webpack config

VuePress split out webpack config into three files: base, client and server. Kind of similar to what [Vue SSR Guide suggest](https://ssr.vuejs.org/guide/build-config.html#build-configuration). It'll invoke the function to create base config no matter it's creating client or server config.

We only need to care client config in this section:
![VuePress dev progress](@assets/vuepress/dev-progress.png)
Let's take a look at the relevant options:

- `define`

> VuePress opened up a concise define option, note that the values has been automatically processed by JSON.stringify.

- `alias`

> The way to set aliases more like configuration than via `chainWebpack`.

- `chainWebpack`

> Edit the internal webpack config with webpack-chain.

VuePress is going to do a lot of things in webpack config. I'd like to mention there's a markdown loader in VuePress which
transforms `.md` file into Vue single-file component. Since all `.md` files are SFC, it can be handled by Vue loader.

Of course, VuePress will also create global constants and set alias at compile time. Global constants are defined for such as debugging, etc. Its relevant API `define` is actually used by many official plugins. When processing client, VuePress benefits from aliases, such as accessing those temp files generated by `clientDynamicModules`.

In the end of creating client config, VuePress run `chainWebpack` which offers the last chance to make the last config.

### Dev server

VuePress leverages [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to handle development.

- `beforeDevServer`

> Equivalent to before in webpack-dev-server. You can use it to define custom handlers before all middleware is executed.

- `afterDevServer`

> Equivalent to after in webpack-dev-server. You can use it to execute custom middleware after all other middleware.

When source files, config or frontmatters are changed, VuePress will rerun [Prepare](#prepare) to reach real hot-reload.
Source files and config are watched by [chokidar](https://github.com/paulmillr/chokidar). In the other hand, watching frontmatters are handled by the markdown loader I mentioned before.

## Build

### Create webpack config

Unlike [Dev](#dev), in this section, we do care both client and server config:

![VuePress build progress](@assets/vuepress/build-progress.png)

Those options executed by creating client config are also executed by creating server config, so we're not going to discuss them again, you can take a look at [the previous section](#create-webpack-config).

But there's some different config between `Build` and `Dev`. The most important thing is using Vue SSR client and server plugin. It'll generate manifest files which provide information for rendering.

### Generate pages

The last option:

- `generated`

> Called when a (production) build finishes, with an array of generated page HTML paths.

What to be generate has been prepared [earlier](#pages). But before generating, VuePress will add a 404 page if it doesn't exist. It means VuePress will also run `extendPageData`.

When generating each file, VuePress will invoke [createBundleRenderer](https://ssr.vuejs.org/api/#createbundlerenderer) which helps VuePress render HTML with those manifest files. Further infos, please head to [Vue SSR](https://ssr.vuejs.org/api/). Those manifest files will be removed very soon after use. That's why you've never seen them in your output folder.

When everything is done, VuePress run `generated`.✌️

## Wrap up

So, this approach really led me from beginning to end. Although it may not cover every concept, it saved me from thinking where should I start? Hope it can help you get clear about VuePress or feel more comfortable to dive into the source code.

::: slot diagram
![VuePress lifecycle](@assets/vuepress/lifecycle.png)
:::
