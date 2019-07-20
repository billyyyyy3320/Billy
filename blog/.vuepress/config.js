module.exports = {
  title: "Billy Chin",
  description: "This is a blog example built by VuePress",
  theme: "@vuepress/theme-blog", // OR shortcut: @vuepress/blog
  themeConfig: {
    modifyBlogPluginOptions(blogPlugnOptions) {
      const writingDirectoryClassifier = {
        id: "about",
        dirname: "_about",
        path: "/about/",
        layout: "IndexAbout",
        itemLayout: "Writing"
      };

      blogPlugnOptions.directories.push(writingDirectoryClassifier);
      return blogPlugnOptions;
    },
    nav: [
      {
        text: "Blog",
        link: "/"
      },
      {
        text: "Tags",
        link: "/tag/"
      },
      {
        text: "About",
        link: "/about/"
      }
    ],
    footer: {
      contact: [
        {
          type: "github",
          link: "https://github.com/newsbielt703"
        }
      ],
      copyright: [
        {
          text: "Privacy Policy",
          link: "https://policies.google.com/privacy?hl=en-US"
        },
        {
          text: "MIT Licensed | Copyright © 2019-present Billyyyyy3320",
          link: ""
        }
      ]
    }
  }
};
