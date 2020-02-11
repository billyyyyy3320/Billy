---
title: 介紹 VuePress 官方部落格主題與套件
date: 2020-01-25
tags:
  - Vue
  - VuePress
  - JavaScript
summary: 使用VuePress建立部落格。有了靜態網站生成器，建立自己的部落格其實很簡單，如果你會寫Vue，VuePress是個很好的選擇，即便你沒用過Vue，你也可以直接套用開箱及用的主題。
comment:
  title: Intro to VuePress blog theme and plugin
---

繁體中文 | [English](/en/2020/01/25/intro-to-vuepress-blog-theme-and-plugin/)

## 前言

我是 VuePress Core Team 的成員 Billy。除了 VuePress 核心以外，我負責官方部落格套件與主題的開發。

如果你不知道 VuePress， 他是一個由 Vue 的作者尤雨溪建立的靜態網站生成器，簡單又輕量，以 markdown 為中心，其特點是能在 markdown 裡使用 Vue，被許多用戶用來撰寫技術文件。如果想進一步了解，你可以參考：

- [VuePress 官方文件](https://vuepress.vuejs.org/)
- [ULIVZ 的文章](https://ulivz.com/2019/06/09/intro-to-vuepress-1-x/)
- [Ben Hong 的文章](https://www.smashingmagazine.com/2019/08/vuepress-documentation/)

在過去 VuePress 只提供預設的文檔主題，然而你可以透過它開發各種靜態網站，除了文件以外，我最常看到的大概非部落格莫屬。而我們在今天正式移除官方部落格套件與主題的 WIP 狀態。

我將在這篇貼文中做快速簡介，不會深入細節，如果你有興趣更深入了解，你可在看完之後去讀官方文件

- [官方部落格主題](https://vuepress-theme-blog.ulivz.com/)
- [官方部落格套件](https://vuepress-plugin-blog.ulivz.com/)

## @vuepress/theme-blog

### 範例

呃其實，我的部落格，你現在所看到的就是一個範例了。你可在我的部落個到處遊蕩一下。

### 快速開始

我知道從頭建起一個專案總是很麻煩無聊，尤其是對於一個新接觸的技術。VuePress Core Team 內已經針對這點做討論，會盡快提供官方腳手架 Cli。在這篇文章裡，你可以暫時先使用我事先準備好的[template](https://github.com/newsbielt703/vuepress-blog-template)。

```sh
git clone https://github.com/newsbielt703/vuepress-blog-template.git # Clone template

cd vuepress-blog-template && yarn # 安裝依賴

yarn dev # 運行在 localhost:8080
```

打開 localhost:8080，相信你已經看到一個現成的部落格了。

### 寫一篇貼文

第一步：建立檔案

預設情況下，所有貼文都必須放在 `_posts` 資料夾內，而檔名格式為`日期-標題.md`，例如`2020-01-25-intro-to-vuepress-official-blog-plugin-and-theme.md`。

```
└── _posts
    ├── ...
    └── 2020-01-25-intro-to-vuepress-official-blog-plugin-and-theme.md
```

第二步：Front matter

[Front matter](https://v1.vuepress.vuejs.org/zh/guide/frontmatter.html) 是用於指定個別檔案的變數，格式是上下兩行三個`-`，中間使用`yaml`語法。必須寫在 Markdown 的最上方，在這主題裡，是各篇貼文的重要資訊：

```yaml
---
title: VuePress 官方預設部落格主題
date: 2020-01-20
tags:
  - Vue
  - VuePress
  - JavaScript
summary: 有了靜態網站生成器，建立自己的部落格其實很簡單，如果你會寫Vue，VuePress是個很好的選擇，即便你沒用過Vue，你也可以直接套用開箱及用的主題。
---

```

只有 `title` 是你必填的，是貼文的標題與 Html title。

第三步：內文

在 Markdown 裡，當然是用 Markdown 語法囉，基本上常見的 Markdown 語法在這都適用。

> Markdown 是一種輕量級標記式語言，創始人為約翰·格魯伯（John Gruber）。它允許人們「使用易讀易寫的純文字格式編寫文件，然後轉換成有效的 XHTML(或者 HTML)文件」。

那 Markdown 我就不多贅述了，而內文就由你自由發揮了。

### 增加互動與能見度

相信你要部落格，就是要給人看的吧，VuePress 作為一個靜態網站生成器已經做了許多優化。這個主題還提供了以下配置，
以下配置都要寫在`.vuepress/config.js`的`themeConfig`裡。

> 以下配置都不是必要配置，請針對你的需求去選擇。

- Sitemap

```js
module.exports = (options, context, api) => {
  return {
    ...
    themeConfig: {
      ...
      sitemap: {
        hostname: "https://billyyyyy3320.com/"
      }
    },
  };
};
```

在`hostname`裡填下你部落格的網址，`sitemap.xml`就會在你執行 build 指令時產生，就那麼簡單，剩下的交給搜尋引擎爬蟲去爬他吧。如果你想要自己提交，他就在`dist`資料夾底下。

- Web Feed 訂閱

```js
module.exports = (options, context, api) => {
  return {
    ...
    themeConfig: {
      ...
      feed: {
        canonical_base: 'https://billyyyyy3320.com/',
      },
    },
  };
};
```

`canonical_base` 是必填的，跟前面 Sitemap 一樣，在`canonical_base`裡填下你部落格的網址，就那麼簡單。預設使用 Rss，但也有提供 Atom 和 JSON feed。

- 留言

預設提供了兩個選擇：

1. [Vssue](https://vssue.js.org/): 基於 issue 的留言服務

```js
module.exports = (options, context, api) => {
  return {
    ...
    themeConfig: {
      ...
      comment: {
        // Which service you'd like to use
        service: 'vssue',
        // The owner's name of repository to store the issues and comments.
        owner: 'You',
        // The name of repository to store the issues and comments.
        repo: 'Your repo',
        // The clientId & clientSecret introduced in OAuth2 spec.
        clientId: 'Your clientId',
        clientSecret: 'Your clientSecret',
      },
    },
  };
};
```

2. [Disqus](https://disqus.com/): 線上留言服務平台

```js
module.exports = (options, context, api) => {
  return {
    ...
    themeConfig: {
      ...
      comment: {
        // Which service you'd like to use
        service: 'disqus',
        // The owner's name of repository to store the issues and comments.
        shortname: 'vuepress-plugin-blog',
      },
    },
  };
};
```

配置完後，留言板會自動在每篇文章最底部生成。

- Email 訂閱

預設整合了[mailchimp](https://mailchimp.com/)來提供 Email 訂閱。

```js
module.exports = (options, context, api) => {
  return {
    ...
    themeConfig: {
      ...
      newsletter: {
        endpoint: 'https://billyyyyy3320.us4.list-manage.com/subscribe/post?u=4905113ee00d8210c2004e038&amp;id=bd18d40138'
      },
    },
  };
};
```

提供`endpoint`就會啟用功能，至於怎麼取得`endpoint`參考[這裡](https://vuepress-plugin-mailchimp.billyyyyy3320.com/#config)，我有做圖片說明。

### 部署

靜態網頁的部署非常簡單，VuePress 官方文件裡有針對各服務的[指南](https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages)。

在這裡以我使用的[Netlify](https://www.netlify.com/)做範例，

```sh
# 把這個部落個推上你的Github

# 去 Netlify 然後登入

# 點擊New site from git

# 選擇 Github

# 選擇你的部落格repo

# 把 Build command 改成 vuepress build blog

# 把 Publish directory 改成 blog/.vuepress/dist

# 按下 Deploy site
```

就醬。

<img src="@assets/20200125/clapping.gif" class="align-center">

## @vuepress/plugin-blog

想必你有疑惑，部落格 套件 跟 主題 差在哪裡？

簡單來講，一個有畫面，一個沒畫面。我們把必要的部落格功能拆出來集成到套件裡，目的是希望它能被重複利用，讓所有想打造部落格主題的開發者更快上手，更專注於介面的開發。

前面所提到的預設部落格主題，其實是可以被客製化的，通過`palette.styl` 或是 `index.stly`，甚至是 VuePress 的繼承主題功能。

- [Palette](https://vuepress-theme-blog.ulivz.com/config/palette.html)
- [Styling in VuePress docs](https://vuepress.vuejs.org/config/#styling)
- [Theme Inheritance](https://vuepress.vuejs.org/theme/inheritance.html)

但是如果你想改的範圍更大，上述方法無法滿足你的話，歡迎你打造你的部落格主題，拓展 VuePress 社群。這時候你就可以使用這個套件，一定會幫你省去許多麻煩。

想寫一個主題，請先詳讀[如何寫一個 VuePress 主題](https://vuepress.vuejs.org/theme/writing-a-theme.html)

### 使用 @vuepress/plugin-blog 的主題

即使之前都還表明還在開發階段，還是有些開發者已經利用這個套件開發部落格主題：

- [@vuepress/theme-blog](https://github.com/vuepressjs/vuepress-theme-blog)
- [vuepress-theme-reco](https://github.com/vuepress-reco/vuepress-theme-reco)
- [vuepress-theme-seeker](https://github.com/wensonsmith/vuepress-theme-seeker)
- [vuepress-theme-modern-blog](https://github.com/z3by/vuepress-theme-modern-blog)
- [vuepress-theme-yuchanns](https://github.com/yuchanns/vuepress-theme-yuchanns)

### 功能介紹

所以說，到底有什麼開箱及用的功能：

- 自定義分類

依照目錄分類文章，像是預設的部落格主題選擇讓使用者把文章都放在`_posts`底下，會把他們都視為貼文列在`/`。你可以自定義目錄，甚至你想要多個目錄，一個`writings`一個`photography`也行。

此外，這個套件也提供 Front matter 分類，像是預設的部落格主題讓使用者在 front matter 定義每篇文章的 tag 來將它分門別類，一樣你可以自定義，你也可以有多個 Front matter 分類，例如：`location` `category`之類。

---

- 符合部落格風格的 Permalink

原本所有 Markdown 檔案會被 VuePress 依照檔名與資料夾名產生對應的 URL，例如：

```
.
└── _posts
    ├── 2018-4-4-intro-to-vuepress.md
    └── 2019-6-8-intro-to-vuepress-next.md

# 會產生

/_posts/2018-4-4-intro-to-vuepress.html
/_posts/2019-6-8-intro-to-vuepress-next.html
```

有了這個套件，你能讓他變的更部落格：

```
/2018/04/04/intro-to-vuepress/
/2019/06/08/intro-to-vuepress-next/
```

---

- 分頁功能

當文章一多，想必你會想將文章分頁。透過這個套件，你只需要設定一頁要幾篇文章，不必自己動手動腦來實現。

而且我們也提供了兩個 UI 組件可以讓你直接使用，當然涉及 UI 絕對不是強制的，你可以透過 Client Api 取得分頁資料來決定你自己的呈現方式。

---

接下來的功能就是提供我稍早所提到的簡單[增加互動與能見度](#增加互動與能見度)的方法。

- Sitemap

在輸出目錄產生 sitemap.xml

- 留言

整合了[Disqus](https://disqus.com/) 與 [Vssue](https://vssue.js.org/)。
並且提供了一個方便的組件 - `<Comment/>`，讓你可以在任何你想要置入留言板的地方插入。

- 訂閱

Web Feed 訂閱，在輸出目錄產生 `rss.xml` or `feed.atom` or `feed.json`。
Email 訂閱，結合[mailchimp](https://mailchimp.com/)，並且如同留言一樣提供了一個現成的組件 - `<SimpleNewsletter/>`，由你選擇他該呈現在哪裡。

## 結語

如果你有任何讓 VuePress 部落格套件與主題更好的想法，直接開個 issue 來討論吧。

- [@vuepress/theme-blog](https://github.com/vuepressjs/vuepress-theme-blog)
- [@vuepress/plugin-blog](https://github.com/vuepressjs/vuepress-plugin-blog)
- [VuePress](https://github.com/vuejs/vuepress)
