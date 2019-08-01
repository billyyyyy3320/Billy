module.exports = {
  title: "Billy Chin",
  description: "Billy Chin's personal website",
  theme: "@vuepress/theme-blog", // OR shortcut: @vuepress/blog
  plugins: [
    [
      "@vuepress/google-analytics",
      {
        ga: process.env.GA // UA-00000000-0
      }
    ]
  ],
  themeConfig: {
    modifyBlogPluginOptions(blogPlugnOptions) {
      const writingDirectoryClassifier = [
        {
          id: "about",
          dirname: "_about",
          path: "/about/"
        },
        {
          id: "en",
          dirname: "_en",
          path: "/en/",
          itemLayout: "Post",
          itemPermalink: "/en/:year/:month/:day/:slug",
          pagination: {
            lengthPerPage: 5
          }
        }
      ];

      blogPlugnOptions.directories = [
        ...blogPlugnOptions.directories,
        ...writingDirectoryClassifier
      ];

      return blogPlugnOptions;
    },
    nav: [
      {
        text: "文章",
        link: "/"
      },
      {
        text: "Articles",
        link: "/en/"
      },
      {
        text: "About",
        link: "/about/"
      },
      {
        text: "Resume",
        link: "https://billychin.netlify.com/resume.pdf"
      }
    ],
    footer: {
      contact: [
        {
          type: "github",
          link: "https://github.com/newsbielt703"
        },
        {
          type: "instagram",
          link: "https://www.instagram.com/billyyyyy3320/"
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
