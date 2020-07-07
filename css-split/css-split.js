const fsOriginal = require("fs");
const fs = fsOriginal.promises;
const path = require("path");
const glob = require("glob");
const url = require("url");
const { PurgeCSS } = require("purgecss");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { COPYFILE_FICLONE } = fsOriginal.constants;

const CONFIG = {
  targetFolder: "../_site",
  html: [
    "index.html",
    "projects/index.html",
    "blog/index.html",
    { path: "blog/*/index.html", outputName: "article" },
  ],
  cssPath: "styles/main.css",
};

function splitCSS(opt) {
  const pathToCss = path.join(__dirname, opt.targetFolder, opt.cssPath);
  const { dir: cssDir } = path.parse(pathToCss);

  opt.html.forEach((html) => {
    let htmlPath;
    if (typeof html === "string") {
      htmlPath = path.join(__dirname, opt.targetFolder, html);
    }

    if (html.path) {
      htmlPath = path.join(__dirname, opt.targetFolder) + "/" + html.path;
    }
    console.log(htmlPath);

    glob(htmlPath, async (er, files) => {
      if (er) {
        console.log("ERRRRRR ", er);
      }

      /**
       * TODO
       *


       * 3. update html link url with new path to CSS
       * 4. write new html to the file
       * 5. run some PurgeCSS tool to remove unused code - pick a tool and then handle it as necessary
       *
       * Critical use vynil for file manipulation and oust to extract <link> tags content
       * consider using JSDOM to do <link> manipulation, see https://github.com/bezoerb/inline-critical/blob/master/src/dom.js for inpiration
       */
      // console.log(files);
      try {
        if (files.length === 0) return;

        /**
         * * 2. copy css file and rename it based on location
         *  - take html file path, get outputhName or first folder if no output name, if first folder is root, keep the styles name, otherwise name it as a folder
         * - když nejsem schopný určit name, tak prostě udělám generické jméno (chunk-43242.css)
         *  *
         *  index.html/index.css -> index.css
         *  projects/index.html -> projects.css
         */
        const { base: rootFolder } = path.parse(path.resolve(__dirname, opt.targetFolder));
        const [cssName] = opt.cssPath.split("/").slice(-1);
        const cssChunkName = getChunkName(htmlPath, rootFolder, cssName, html.outputName);
        console.log(pathToCss, path.join(cssDir, cssChunkName));
        // 3. copy CSS files
        await fs.copyFile(pathToCss, path.join(cssDir, cssChunkName), COPYFILE_FICLONE);

        // 1. Read each file and update it's link url with new file name
        // 4. Update HMLT link to CSS
        const fileUpdates = await Promise.all(
          files.map(async (file) => {
            const content = await fs.readFile(file, "utf-8");

            const cssLinkSelectors = ['link[rel="stylesheet"]', 'link[rel="preload"][as="style"]'];
            const dom = new JSDOM(content);
            const { document } = dom.window;
            const cssLinks = document.querySelectorAll(cssLinkSelectors.join(", "));

            Array.from(cssLinks)
              .filter((link) => {
                const href = url.parse(link.getAttribute("href"));
                const { pathname } = href;
                const [fileName] = pathname.split("/").slice(-1);

                return fileName === cssName;
              })
              .forEach((link) => {
                const oldHref = url.parse(link.getAttribute("href"));
                const { pathname, search } = oldHref;
                const pathArr = pathname.split("/");
                const newHref = (pathArr.splice(-1, 1, cssChunkName), pathArr).join("/") + search;

                link.setAttribute("href", newHref);
              });

            await fs.writeFile(file, dom.serialize());
          })
        );

        // 5. purge files
        const purgeCSSResult = await new PurgeCSS().purge({
          content: [htmlPath],
          css: [path.join(cssDir, cssChunkName)],
        });
        const concatenateCSS = purgeCSSResult.map((res) => res.css).join();
        console.log(concatenateCSS);
        await fs.writeFile(path.join(cssDir, cssChunkName), concatenateCSS, "utf-8");
        console.log("file processd");
      } catch (e) {
        console.log("ERR", e);
      }
    });
  });
}

function getChunkName(htmlPath, root, cssName, outputName) {
  if (outputName) {
    return `${outputName}.css`;
  }

  const { dir } = path.parse(htmlPath);
  const [closestFolder] = dir.split("/").slice(-1);

  if (root === closestFolder) {
    return "index.css";
  }

  if (!closestFolder.match(/^\*\*?$/)) {
    return `${closestFolder}.css`;
  }

  // fallback if we can't decide on another file name
  return `chunk-${Math.random().toString(36).substr(2, 9)}.css`;
}

// function getHrefCSSParts(cssHref, newName) {
//   const a = new URL(cssHref)

//   const {path}

//   return
// }

splitCSS(CONFIG);
