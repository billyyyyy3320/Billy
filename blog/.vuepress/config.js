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
          text: "Billy Chin © 2019",
          link: ""
        }
      ]
    },
    paginationComponent: "SimplePagination"
  }
};
