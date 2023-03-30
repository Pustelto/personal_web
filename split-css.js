const cssSplit = require("@pustelto/css-split");

const CONFIG = {
  targetFolder: "_site",
  html: [
    "index.html",
    "projects/index.html",
    "blog/index.html",
    "talks/index.html",
    { path: "blog/*/index.html", outputName: "article" },
  ],
  cssPath: "styles/main.css",
};

cssSplit(CONFIG);
