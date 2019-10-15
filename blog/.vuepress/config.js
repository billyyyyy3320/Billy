const path = require("path");
module.exports = (options, context, api) => {
  return {
    title: "Billy Chin",
    description: "Billy Chin's personal website",
    theme: "@vuepress/blog",
    plugins: [
      [
        "@vuepress/google-analytics",
        {
          ga: process.env.GA
        }
      ]
    ],
    themeConfig: {
      modifyBlogPluginOptions(blogPluginOptions) {
        const writingDirectoryClassifier = [
          {
            id: "zh",
            dirname: "_zh",
            path: "/zh/",
            itemLayout: "Post",
            itemPermalink: "/zh/:year/:month/:day/:slug",
            pagination: {
              lengthPerPage: 5
            }
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
        const sitemap = {
          hostname: "https://billychin.netlify.com/"
        };
        const comment = {
          service: "vssue",
          autoCreateIssue: true,
          prefix: "[Post]",
          owner: "newsbielt703",
          repo: "billy",
          clientId: "4119e8c1b0093fc5d034",
          clientSecret: "1ac1176791689b1ca31037c39489fc7b0667015d"
        };
        blogPluginOptions.directories = [...writingDirectoryClassifier];
        return { ...blogPluginOptions, sitemap, comment };
      },
      nav: [
        {
          text: "貼文",
          link: "/zh/"
        },
        {
          text: "Blog",
          link: "/en/"
        }
        // {
        //   text: "Resume",
        //   link: "https://billychin.netlify.com/resume.pdf"
        // }
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
    },
    alias: {
      "@assets": path.resolve(__dirname, "../assets")
    }
  };
};
