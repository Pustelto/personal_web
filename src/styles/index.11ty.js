const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

// the file name as an entry point for postcss compilation
// also used to define the output filename in our output /css folder.
const fileName = "index.css";

module.exports = class {
  async data() {
    const rawFilepath = path.join(__dirname, `../_includes/css/${fileName}`);
    return {
      permalink: `styles/${fileName}`,
      rawFilepath,
      rawCss: await fs.readFileSync(rawFilepath),
      eleventyExcludeFromCollections: true,
    };
  }

  async render({ rawCss, rawFilepath }) {
    return await postcss([
      require("precss")({
        stage: 4,
        autoprefixer: { flexbox: false },
      }),
      require("postcss-import"),
      require("postcss-custom-media"),
      require("postcss-strip-units"),
      require("@hail2u/css-mqpacker"),
      require("cssnano")({
        preset: "advanced",
      }),
      require("postcss-extract-media-query")({
        output: {
          path: path.join(__dirname, "../../_site/styles"),
          name: "[name]-[query].[ext]",
        },
        queries: {
          "screen and (min-width:30rem)": "mobile",
          "screen and (min-width:45rem)": "tablet",
          "screen and (max-width:44.9375rem)": "onlyTablet",
        },
      }),
    ])
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};
