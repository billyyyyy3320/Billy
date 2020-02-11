---
title: Intro to VuePress blog theme and plugin
date: 2020-01-25
tags:
  - Vue
  - VuePress
  - JavaScript
summary: Build a blog with VuePress. With static site generator, it's pretty easy to build your own blog. If you're familiar with Vue, VuePress could be a good choice. Even though you've never used vue before, you can still use the out-of-box theme.
---

[繁體中文](/zh/2020/01/25/intro-to-vuepress-blog-theme-and-plugin/) | English

## Preface

I'm a member of VuePress Core Team. I'm maintaining and developing not only VuePress Core but also official blog plugin and theme.

If you've never heard of VuePress, it's light-weight and simple static site generator created by Evan You(the author of Vue). Using Vue in Markdown is its characteristic. Many people use it to build their documentation site. See below to get more information:

- [Documentation of VuePress](https://vuepress.vuejs.org/)
- [ULIVZ's article](https://medium.com/@_ulivz/intro-to-vuepress-1-x-7e2b7885f95f)
- [Ben Hong's article](https://www.smashingmagazine.com/2019/08/vuepress-documentation/)

In earlier times, VuePress only provided a default documentation theme, but you're able to build several kinds of static site. Apart from documentation, blog is the most common usage I've noticed. The good news is we removed the WIP status from official blog plugin and theme today.

I'm going to make a short introduction without mentioning every nook and cranny. So, you can start here, and then check out the docs when you want to learn the material more deeply:

- [Official blog theme](https://vuepress-theme-blog.ulivz.com/)
- [Official blog plugin](https://vuepress-plugin-blog.ulivz.com/)

## @vuepress/theme-blog

### Demo

Well, actually, my blog what you're watching now is a demo. Just navigate around my blog.

### Quick start

I know that it's always been tough to set up a new project from scratch, especially with a new technology. We've started discussing it in VuePress Core Team, and will provide an official scaffolding tool ASAP. You can temporarily use my [template](https://github.com/newsbielt703/vuepress-blog-template) in this article.

```sh
git clone https://github.com/newsbielt703/vuepress-blog-template.git # Clone template

cd vuepress-blog-template && yarn # Install dependencies

yarn dev # Run dev server at localhost:8080
```

Check out `localhost:8080` to get a blog.

### Adding a Post

Step 1: New file

By default, posts should be placed under `_posts` directory. `[date]-[title].md` is the file name format, such as:`2020-01-25-intro-to-vuepress-official-blog-plugin-and-theme.md`.

```
└── _posts
    ├── ...
    └── 2020-01-25-intro-to-vuepress-official-blog-plugin-and-theme.md
```

Step 2: Front matter

[Front matter](https://v1.vuepress.vuejs.org/guide/frontmatter.html) is used to configure settings for your writings. It must be the first thing in the Markdown file and must take the form of valid YAML set between triple-dashed lines.

```yaml
---
title: Intro to VuePress blog theme and plugin
date: 2020-01-25
tags:
  - Vue
  - VuePress
  - JavaScript
summary: Build a blog with VuePress. With static site generator, it's pretty easy to build your own blog. If you're familiar with Vue, VuePress could be a good choice. Even though you've never used vue before, you can still use the out-of-box theme.
---

```

Only `title` is required. It's the title of the post and Html title.

Step 3: Content

Since it's inside a `.md` file, content should definitely be written in Markdown syntax.

> John Gruber created the Markdown language with the goal of enabling people "to write using an easy-to-read and easy-to-write plain text format, optionally convert it to structurally valid XHTML (or HTML)".

That's it. Write whatever you want.

### Increasing visibility and interactability

Now, you have a blog, you definitely want to get more people to read your blog. As a static site generator, VuePress has optimized it. Moreover, this theme provide corresponding config below. All the config below should be written in `themeConfig` in `.vuepress/config.js`.

> None of config below are required, please make your choice depending on your needs.

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

By filling out `hostname` with your blog URL,`sitemap.xml` will be generated when you run the build command.
Just leave it to search engine crawlers. If you'd like to submit manually, you can find the generated file in `dist` folder.

- Web Feed

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

`canonical_base` is required. Fill out `canonical_base` with your blog URL just like what you have to do to enable Sitemap.

Rss feed will be used by default, but Atom and JSON feed are also available.

- Comment

Here're two options:

1. [Vssue](https://vssue.js.org/): An issue-based comment service

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

2. [Disqus](https://disqus.com/): An online comment service platform

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

Comments will be generated automatically at the bottom of each post when you get it setup properly.

- Newsletter

By default, [mailchimp](https://mailchimp.com/) is integrated to provide email subscribing.

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

It'll be enabled by offering `endpoint`. As for how to get `endpoint`, please refer [here](https://vuepress-plugin-mailchimp.billyyyyy3320.com/#config) where I've illustrated with screenshots.

### Deploying

It's pretty easy to deploy a static site. There's a [guide](https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages) in VuePress documentation to help you deploy on each services.

As I'm using [Netlify](https://www.netlify.com/), I'll demonstrate with it:

```sh
# Push this blog to your Github

# Go to Netlify and log in

# Click `New site from git`

# Select `Github`

# Select your blog repo

# Fill out `Build command` with `vuepress build blog`

# Fill out `Publish directory` with `blog/.vuepress/dist`

# Deploy site
```

That's it.

<img src="@assets/20200125/clapping.gif" class="align-center">

## @vuepress/plugin-blog

Probably, you have doubt about what’s the differences between the plugin and theme?

In short, one is invisible, the other is visible. We try to split all common blog features up into the plugin. Its purpose is to make it reusable.

> We hope that for blog theme developers pay more attention to the interactive experience of the theme itself, rather than the logic of classification, pagination, etc. that are invisible and not of interest to users.

Actually, the official blog theme is configurable and customizable with `palette.styl`, `index.stly` and even the theme inheritance feature of VuePress.

- [Palette](https://vuepress-theme-blog.ulivz.com/config/palette.html)
- [Styling in VuePress docs](https://vuepress.vuejs.org/config/#styling)
- [Theme Inheritance](https://vuepress.vuejs.org/theme/inheritance.html)

But if you can't content with the above mentioned approaches, welcome to build your own blog theme and help VuePress community grow. In this scenario, you can use this plugin which might save you from the hassle.

Before start, please read [how to write a VuePress theme](https://vuepress.vuejs.org/theme/writing-a-theme.html).

### Themes using @vuepress/plugin-blog

Even though it was WIP, some developers has already used this plugin to build blog themes:

- [@vuepress/theme-blog](https://github.com/vuepressjs/vuepress-theme-blog)
- [vuepress-theme-reco](https://github.com/vuepress-reco/vuepress-theme-reco)
- [vuepress-theme-seeker](https://github.com/wensonsmith/vuepress-theme-seeker)
- [vuepress-theme-modern-blog](https://github.com/z3by/vuepress-theme-modern-blog)
- [vuepress-theme-yuchanns](https://github.com/yuchanns/vuepress-theme-yuchanns)

### Features

So, what out-of-box features are presented?

- Customize classification

Classifying posts based on directory, for instance, official blog theme assumes all `.md` files under `_posts` are blog posts and list them on `/`. You're able to set a custom directory or even directories, such as Classifying by `writing` and `photography` directory.

In addition, this plugin provide Front matter classification, for instance, official blog theme let users define tags for each post to classify theme. Again you're able to customize, and have more than a classifiers, such as, `location`, `category` etc.

---

- Blog-styled permalinks

The converted page URLs of Markdown files are based on the file hierarchy, for instance":

```
.
└── _posts
    ├── 2018-4-4-intro-to-vuepress.md
    └── 2019-6-8-intro-to-vuepress-next.md

# The converted page URLs

/_posts/2018-4-4-intro-to-vuepress.html
/_posts/2019-6-8-intro-to-vuepress-next.html
```

With this plugin, you can make it more blogging:

```
/2018/04/04/intro-to-vuepress/
/2019/06/08/intro-to-vuepress-next/
```

---

- Pagination

As your posts grew more and more, you began to have the need for paging. With this plugin, you're only required to set up something like how many posts per page without paying attention on the logic.

Besides, There're two out-of-box UI components. Off course, it's not compulsory since it's about UI. You're able to display it as you wish with client api.

---

Next features are presenting to easily achieve what I've mentioned [Increasing visibility and interactability](#increasing-visibility-and-interactability).

- Sitemap

Generate `sitemap.xml` in the output folder.

- Comment

Integrate [Disqus](https://disqus.com/) and [Vssue](https://vssue.js.org/) and provide a convenient component - `<Comment/>` so that you can embed wherever you like.

- Subscription

Web Feed - Generate `rss.xml` or `feed.atom` or `feed.json` in the output folder.
Newsletter - Integrate [mailchimp](https://mailchimp.com/), and provide a convenient component - `<SimpleNewsletter/>` so that you can embed wherever you like.

## Wrap up

Feel free to open an issue about anything that you think can be better so that we can discuss further.

- [@vuepress/theme-blog](https://github.com/vuepressjs/vuepress-theme-blog)
- [@vuepress/plugin-blog](https://github.com/vuepressjs/vuepress-plugin-blog)
- [VuePress](https://github.com/vuejs/vuepress)
