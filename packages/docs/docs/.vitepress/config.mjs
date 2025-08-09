import { defineConfig } from "vitepress";

export default defineConfig({
  title: "AavanamKit",
  description: "The Modern Document Generation Toolkit for Web Applications.",

  // Metadata for social sharing (Open Graph)
  head: [
    ["meta", { property: "og:title", content: "AavanamKit" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "The open-source document generation ecosystem that gives the design power back to your users.",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://aavanamkit-demo.vercel.app/og-image.png",
      },
    ], // We will need to create this image
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ],

  themeConfig: {
    logo: "/logo.svg", // Assumes you've placed logo.svg in packages/docs/docs/public/

    nav: [
      { text: "Guide", link: "/guide/introduction" },
      { text: "API Reference", link: "/api/designer-props" },
      { text: "Live Demo", link: "https://aavanamkit-demo.vercel.app/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "What is AavanamKit?", link: "/guide/introduction" },
            { text: "Getting Started", link: "/guide/getting-started" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "@aavanamkit/designer", link: "/api/designer-props" },
            { text: "@aavanamkit/engine", link: "/api/engine-function" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/jafranjemal/aavanamkit" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 The AavanamKit Project Contributors",
    },
  },
});
