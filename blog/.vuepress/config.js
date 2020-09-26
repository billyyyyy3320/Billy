module.exports = (options, context, api) => {
  return {
    title: "蔡玉汝的網站",
    description: "蔡玉汝的網站",
    theme: "@vuepress/blog",
    themeConfig: {
      directories: [
        {
          id: "zh",
          dirname: "_zh",
          title: "貼文",
          path: "/zh/",
          itemPermalink: "/zh/:year/:month/:day/:slug"
        },
      ],
      nav: [
        {
          text: "貼文",
          link: "/zh/"
        },
      ],
      footer: {
        copyright: [
          {
            text: "蔡玉汝 © 2020",
            link: ""
          }
        ]
      },
      smoothScroll: true
    },
  };
};
