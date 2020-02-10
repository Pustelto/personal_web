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
      eleventyExcludeFromCollections: true
    };
  }

  async render({ rawCss, rawFilepath }) {
    return await postcss([
      // require('postcss-comment'),
      require("precss"),
      require("postcss-import"),
      require("postcss-custom-media"),
      // require('postcss-color-mix'),
      // postCssColors(),
      // require('postcss-color-function'),
      require("postcss-strip-units"),
      require("cssnano")({
        preset: "advanced"
      })
    ])
      .process(rawCss, { from: rawFilepath })
      .then(result => result.css);
  }
};
