import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AavanamKit",
  description: "The Modern Document Generation Toolkit",

  // Theme configuration
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.svg", // We will create this file

    nav: [
      { text: "Guide", link: "/guide/introduction" },
      { text: "API", link: "/api/designer-props" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/introduction" },
            { text: "Getting Started", link: "/guide/getting-started" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Designer Props", link: "/api/designer-props" },
            { text: "Engine Function", link: "/api/engine-function" },
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
