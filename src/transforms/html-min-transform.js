const htmlmin = require("html-minifier");

module.exports = function htmlMinTransform(value, outputPath) {
  if (typeof outputPath === "string" && outputPath.indexOf(".html") > -1) {
    let minified = htmlmin.minify(value, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyCSS: true,
      minifyJS: true
    });
    return minified;
  }
  return value;
};
