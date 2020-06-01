require("dotenv").config();

const site_title = "GPA For Me";
const site_description =
  "Real time GPA Calculator. Calculate your semester and cumulative grade point average easily with this calculator.";
const site_keywords =
  "GPA Calculator, Cumulative GPA, Cumulative GPA Calculator, Real Time GPA, HS GPA Calculator, College GPA Calculator, GPA for me, gpaforme, Calculate your GPA, GPA";
const site_url = "https://gpafor.me";

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: site_title,
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        hid: "description",
        name: "description",
        content: site_description,
      },
      {
        name: "keywords",
        content: site_keywords,
      },
      {
        name: "msapplication-TileColor",
        content: "#ffc40d",
      },
      {
        name: "theme-color",
        content: "#ffffff",
      },
      /**
       * TWITTER SEO
       */
      {
        hid: "twitter:url",
        name: "twitter:url",
        content: site_url,
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: site_title,
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: site_title,
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: site_description,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "/logo.png",
      },
      /**
       * Open Graph SEO
       */
      {
        hid: "og:title",
        name: "og:title",
        content: site_title,
      },
      {
        hid: "og:url",
        property: "og:url",
        content: site_url,
      },
      {
        hid: "og:type",
        property: "og:type",
        content: "website",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "/logo.png",
      },
      {
        hid: "og:site_name",
        name: "og:site_name",
        content: site_title,
      },
      {
        hid: "og:description",
        name: "og:description",
        content: site_description,
      },
      {
        hid: "og:locale",
        name: "og:locale",
        content: "en_US",
      },
      /**
       * For Search Engine Crawling
       */
      {
        hid: "robots",
        name: "robots",
        content: "index,follow",
      },
      {
        hid: "googlebot",
        name: "googlebot",
        content: "index,follow",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&family=Raleway:wght@300;400;500&display=swap",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
      {
        rel: "mask-icon",
        href: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
    script: [
      {
        src: "https://kit.fontawesome.com/aa543d2585.js",
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#825E3A",
    height: "4px",
  },
  /*
   ** Global CSS
   */
  css: [
    {
      src: "~/assets/scss/app.scss",
      lang: "scss",
    },
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: "~/plugins/webFontLoader.client.js",
    },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    [
      "@nuxtjs/google-analytics",
      {
        id: process.env.GOOGLE_ANALYTICS,
      },
    ],
    "@nuxtjs/dotenv",
    "bootstrap-vue/nuxt",
    "@nuxtjs/sitemap",
  ],
  /**
   * Auth
   */
  auth: {
    redirect: {
      login: "/", // redirect user when not connected
      callback: "/auth/signedin",
    },
    strategies: {
      local: false,
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        audience: process.env.AUTH0_AUDIENCE,
      },
    },
  },
  /*
   ** Disable Bootstrap-Vue auto import CSS
   */
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
  },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.(css|vue)$/,
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
    filenames: {
      app: ({ isDev }) => (isDev ? "[name].js" : "[chunkhash].js"),
      chunk: ({ isDev }) => (isDev ? "[name].js" : "[chunkhash].js"),
    },
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
    },
  },
  sitemap: {
    hostname: site_url,
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    defaults: {
      changefreq: "weekly",
      priority: 1,
      lastmod: new Date(),
      lastmodrealtime: true,
    },
    routes: ["/"],
  },
};
