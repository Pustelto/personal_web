const readdirp = require("readdirp");
const critical = require("critical");

const cfg = {
  fileFilter: ["*.html"],
  directoryFilter: ["!node_modules"],
  PUBLISH_DIR: "_site",
  minify: true,
  extract: false,
  width: 920,
  height: 960,
};

const getHtmlFiles = async (directory, inputs = {}) => {
  const files = await readdirp.promise(directory, {
    fileFilter: inputs.fileFilter,
    directoryFilter: inputs.directoryFilter,
  });

  return files.map((file) => file.fullPath);
};

async function extractCriticalCSS({ cfg }) {
  const htmlFiles = await getHtmlFiles(cfg.PUBLISH_DIR, cfg);

  try {
    // Ignore penthouse/puppeteer max listener warnings.
    // See https://github.com/pocketjoso/penthouse/issues/250.
    // One penthouse call is made per page and per screen resolution.
    process.setMaxListeners(2);

    // Process each page in sequence to avoid lingering processes and memory
    // issues, at the cost of a slower execution.
    // `critical` might offer this feature at some point:
    // https://github.com/addyosmani/critical/issues/111
    for (const filePath of htmlFiles) {
      await critical.generate({
        base: cfg.PUBLISH_DIR,
        // Overwrite files by passing the same path for `src` and `target`.
        src: filePath,
        target: filePath,
        inline: true,
        minify: cfg.minify,
        extract: cfg.extract,
        width: cfg.width,
        height: cfg.height,
        // Force critical to run penthouse only on a single page at a time to
        // avoid timeout issues.
        concurrency: 1,
        // Bump penthouse’s page load timeout to 2 minutes to avoid crashes
        // which could cause lingering processes as it’s possible some pages
        // can take a long time to load.
        penthouse: { timeout: 120000 },
      });
    }

    console.log("Critical CSS successfully inlined!");
  } catch (error) {
    console.log("Failed to inline critical CSS.", { error });
    return error;
  }
}

extractCriticalCSS({ cfg });
