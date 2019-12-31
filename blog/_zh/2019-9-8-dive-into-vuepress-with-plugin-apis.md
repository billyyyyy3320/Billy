---
layout: PostWithDiagram
date: 2019-9-8
tag:
  - Vue
  - VuePress
  - JavaScript
summary: 插件化是 Vuepress 1.x 的最大改變。這讓我突發奇想，如果我了解了所有plugin api的執行順序以及到底做了什麼，這會是個了解VuePress運作來龍去脈的特別途徑。
comment:
  title: Dive into VuePress with Plugin APIs
---

# 透過插件 API 來深入了解 VuePress

繁體中文 | [English](/en/2019/09/08/dive-into-vuepress-with-plugin-apis/)

## 插件 ???

`Pluggable`是 VuePress 1.x 的最重大改變。VP 提供給開發者許多 API 來打造他們的插件，VP 本身的許多功能也是依靠插件化實現的。此外，`.vuepress/config.js` 和 `theme/index.js` 其實也都被視為插件。

我有天閃過一個想法，如果我了解了所有插件 API 的執行順序以及他到底做了什麼，或許這是一個特殊的方法來了解 VP 運作的來龍去脈。

### 暖暖身

首先，來看看所有的插件 API：

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

我有做了一張圖來呈現整個生命週期。網頁標頭上有個開關按鈕（上方正中央），按下去就會出現了。請注意它是可以上下滾動的。希望它會幫助到你。

### 插件如何運作

所有 API 都會在最一開始被初始化，有自己的 class 類別，有興趣的話可以看看`@vuepress/core/lib/node/plugin-api/abstract`。之後 VP 在取得插件設定時，會把他們推送至相對應的地方集中，他們會在我的那張圖裡所顯示的時機被執行。

## 準備

眾所週知 VP 可以透過`vuepress dev` 或 `vuepress build`來執行。先不管是被哪個指令觸發，他都得進入這個階段。（這章節叫準備是因為這個 Function 在 VP 0.x 被命名為 `prepare`）

### Markdown

我猜你大概已經知道 VP 用[Markdown-it](https://github.com/markdown-it/markdown-it)來渲染 Markdwon 內容。

生命週期中的首兩個 API 是：

- `chainMarkdown`

> 使用 markdown-it-chain 来修改内部的 markdown 配置。

- `extendMarkdown`

> 一个函数，修改内部用于渲染 markdown 文件的 markdown-it 实例的配置、或者应用一些额外的插件。

首先，VP 需要配置 markdown-it 的設定。這邊 VP 利用[markdown-it-chain](https://github.com/ulivz/markdown-it-chain)來完成，markdown-it-chain 是被依照 webpack-chain 的基礎開發的。在配置中，VP 增加很多 markdown-it 插件（其中大多數是 VP 建立的）。

然後 VP 會開始執行`chainMarkdown`來跟上面相同的方法配置 markdown-it。在 markdown-it-chain 透過上述所有配置建立出 markdown-it 的配置實例後，VP 開始執行`extendMarkdown`。

那些跟撰寫 Markdown 有關的好用功能大概都是在這裡被完成的，像是提供縮寫來建立漂亮 UI 組件的`Custom Containers`，或是將`Internal Links`轉換成`<router-link>`來實現 SPA 頁面導向，等等。

### Pages

接下來我要討論的 API 是：

- `extendPageData`

> 一个函数，用于拓展或者修改 \$page 对象。这个函数将会在编译器为每个页面执行一次。

- `additionalPages`

> 增加一个指向某个 markdown 文件的页面。

VP 會在找出來源資料夾中的所有頁面檔案後開始處理他們。它會產出頁面的 title 和 headers、處理 frontmatters 等等。這些資訊會被儲存用來在之後渲染時使用。

VP 會在每個頁面被處理後執行`extendPageData`。當全部都好了時，就是執行`additionalPages`的時機了。那些被`additionalPages`所新增的頁面也會被以同樣的方式處理，而且`extendPageData`也會被調用。

### Ready

有五個 API 在這個段落：

- `ready`

> ready 钩子在应用初始化之后，并在某些特定的函数式 API 执行之前执行。

- `clientDynamicModules`

> 在编译期间生成一些在客户端使用的模块。

- `clientRootMixin`

> 指向 mixin 文件的路径，它让你可以控制根组件的生命周期。

- `enhanceAppFiles`

> 此选项接受指向增强文件的绝对文件路径或返回该路径的函数，你可以通过此选项做一些应用级别的配置。

- `globalUIComponents`

> 注入某些全局的 UI，并固定在页面中的某处。

在頁面都被處理完後，VP 會執行`ready`。或許你會有興趣知道[styling](https://v1.vuepress.vuejs.org/config/#styling)是透過內部插件使用`ready`來完成的。

再來，執行最常被內部插件使用的`clientDynamicModules`。它是為什麼我們能讀取到[Global Computed](https://v1.vuepress.vuejs.org/guide/global-computed.html#global-computed)、免手動配置 Vue router 路徑就能使用 SPA 頁面導向 、頁面組件或 layout 組件如何被引入的。此外，接下來的`clientRootMixin`也是被`clientDynamicModules`處理的。他會產出一些暫存檔案來讓 VuePress 客戶端可以使用。你可以在`@vuepress/core/.temp`查看。

`enhanceAppFiles` 和 `globalUIComponents` 使用相似的方法處理。 VuePress 客戶端會透過他們所產出的暫存檔案來做些應用級別的配置或是註冊那些 UI components。

接下來 VP 會做的事取決於你執行哪個指令。

## 自定義的指令

- `extendCli`

> 注册一个额外的 command 来增强 VuePress 的 CLI。这个函数将会以一个 [CAC](https://github.com/cacjs/cac) 的实例作为第一个参数被调用。

VP 利用[CAC](https://github.com/cacjs/cac)來打造它的命令列介面。在 CAC 解析參數前，VP 會檢查 node 版本、註冊[core commands](https://v1.vuepress.vuejs.org/api/cli.html#command-line-interface)並處理包含你客製指令的未知指令。

注意你得要告訴 VP 你的來源檔案在哪，例如：`vuepress hello docs`。VP 需要執行全部我前面提到的[準備](#準備)，不然他沒辦法讀取到`extendCli`。

## Dev

### 建立 webpack 配置

VP 把 webpack 配置拆分成三個檔案：base、client、server。有點像是[Vue SSR Guide 的建議](https://ssr.vuejs.org/guide/build-config.html#build-configuration)。不論 VP 是在建立 client 或是 server 配置，它都會建立出 base 配置。

在這段落我們只在乎 client 配置：
![VuePress dev progress](@assets/vuepress/dev-progress.png)
來看看對應的 API 吧：

- `define`

> VuePress 特别开辟了一个更简洁的 define 选项。值得注意的是这些值已自动地被 JSON.stringify 处理。

- `alias`

> 通过 chainWebpack 来配置别名，alias 可以使这个流程更像配置。

- `chainWebpack`

> 使用 webpack-chain 来修改内部的 webpack 配置。

VP 會在 webpack 配置中下許多功夫。我自己覺得最值得一提的是在 VP 中有個 markdown loader 來將`.md`檔案轉換成 Vue SFC。既然所有`.md`都是 SFC，那它就能被 Vue loader 處理了。

當然 VP 在編譯的時候也會建立全域常數和設置別名。定義全域常數來做 debug 之類的事情。而與他相對應的 API`define`被許多官方插件使用。當 VP 在處理客戶端時受到別名很多幫助，像是讀取那些被`clientDynamicModules`產生的檔案。

在建立 client 配置的最後一步，VP 執行`chainWebpack`來提供最後機會做最後的設定。

### Dev server

VP 利用[webpack-dev-server](https://github.com/webpack/webpack-dev-server)來掌握開發模式。

- `beforeDevServer`

> 等同于 webpack-dev-server 中的 before，你可以用其在所有中间件的之前去执行一些自定义的中间件。

- `afterDevServer`

> 等同于 webpack-dev-server 中的 after，你可以用其在所有中间件的最后去执行一些自定义的中间件。

每當來源檔案被新增或移除、配置或 frontmatters 改變，VP 會重新執行[準備](#準備)來達到真正的 hot-reload。
來源檔案和配置被[chokidar](https://github.com/paulmillr/chokidar)監聽，而 frontmatters 是被我先前所提的 markdown loader 所監聽。

## Build

### 建立 webpack 配置

這個段落跟[Dev](#dev)不同，不論 client 還是 server 的配置我們都在乎：

![VuePress build progress](@assets/vuepress/build-progress.png)

因為那些在 client 配置中被調用的 API 也都會在建立 server 配置中被調用，所以我們不會再討論一次，如果你有興趣可以回頭看[前面的段落](#建立-webpack-配置)。

但是`Build`和`Dev`間還是有些差異。最重要的差別是使用 Vue SSR client 及 server 插件。他會產生 manifest 檔案來提供渲染用的資訊。

### 生成頁面

最後的 API：

- `generated`

> 在生产环境的构建结束后被调用，生成的页面的路径数组将作为该函数的第一个参数。

要被生成的東西都早在[之前](#pages)準備了。在生成之前，如果沒有 404 頁面 VP 將會先新增它，這也代表 VP 也會在這執行`extendPageData`。

當生成各個檔案時，VP 會調用 [createBundleRenderer](https://ssr.vuejs.org/api/#createbundlerenderer)來幫助 VP 利用那些 manifest 來渲染 HTML。更多資訊，請前往[Vue SSR](https://ssr.vuejs.org/api/)。那些 manifest 很快的會在使用後被移除，所以你從來不會再輸出資料夾看到它。

當所有事都完成時，VP 執行`generated`。✌️

## 總結

所以這個方法的確領著我穿梭了整個流程。縱使可能沒有掌握到所有概念，至少他幫我解決了到底要從哪開始的困擾。希望這篇文章能幫助你更了解 VP 或是讓你更輕鬆地去深入 source code。

::: slot diagram
![VuePress lifecycle](@assets/vuepress/lifecycle.png)
:::
