const path = require("path");
module.exports = (options, context, api) => {
  return {
    title: "Billy Chin",
    description: "Web development, Frontend, JavaScript",
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
      directories: [
        {
          id: "zh",
          dirname: "_zh",
          title: "貼文",
          path: "/zh/",
          itemPermalink: "/zh/:year/:month/:day/:slug"
        },
        {
          id: "en",
          dirname: "_en",
          title: "Post",
          path: "/en/",
          itemPermalink: "/en/:year/:month/:day/:slug"
        }
      ],
      sitemap: {
        hostname: "https://billyyyyy3320.com/"
      },
      comment: {
        service: "vssue",
        autoCreateIssue: true,
        prefix: "[Post]",
        owner: "newsbielt703",
        repo: "billy",
        clientId: "4119e8c1b0093fc5d034",
        clientSecret: "1ac1176791689b1ca31037c39489fc7b0667015d"
      },
      newsletter: {
        endpoint:
          "https://gmail.us5.list-manage.com/subscribe/post?u=942c0d587f8ea28269e80d6cd&amp;id=d77d789d53"
      },
      feed: {
        canonical_base: "https://billyyyyy3320.com/",
        posts_directories: ["/_en/"]
      },
      nav: [
        {
          text: "貼文",
          link: "/zh/"
        },
        {
          text: "Blog",
          link: "/en/"
        },
        {
          text: "Github",
          link: "https://github.com/newsbielt703"
        }
      ],
      footer: {
        contact: [
          {
            type: "github",
            link: "https://github.com/newsbielt703"
          },
          {
            type: "mail",
            link: "mailto:newsbielt703@gmail.com"
          }
        ],
        copyright: [
          {
            text: "Billy Chin © 2019",
            link: ""
          }
        ]
      },
      smoothScroll: true
    },
    alias: {
      "@assets": path.resolve(__dirname, "../assets")
    }
  };
};
