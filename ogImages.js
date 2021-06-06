const puppeteer = require("puppeteer");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

async function getData() {
  data = await fsp.readFile(path.join(__dirname, "_site/og_images_data.json"));
  return JSON.parse(data);
}

async function createTemplate(data) {
  return `<!DOCTYPE html><html lang="en"><meta charset="UTF-8" /><meta content="width=device-width,initial-scale=1" name="viewport" /><link href=https://fonts.gstatic.com rel=preconnect><link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700;900&display=swap" rel="stylesheet" /> <body> <style> body { margin: 0; } .wrapper { width: 1200px; height: 630px; padding: 80px 100px; box-sizing: border-box; display: grid; grid-template-rows: 70px min-content 1fr 46px; grid-gap: 20px; font-family: "Source Sans Pro"; } .name { font-size: 36px; font-weight: 700; line-height: 1.5; margin-top: -13px; align-self: end; } .name:after { content: ""; display: block; height: 5px; width: 85px; background: #30a5bf; margin-top: 20px; margin-bottom: 0; } .title { font-size: 76px; font-weight: 900; margin: 0; letter-spacing: 0.1px; line-height: 1.1; margin-bottom: 10px; } .tags { font-size: 28px; line-height: 1.5; display: flex; list-style: none; margin: 0; padding: 0; color: #757575; } .tags li:not(:first-child):before { content: "|"; display: inline-block; margin: 0 0.75ch; } .link { font-size: 28px; color: #757575; line-height: 1.5; margin-top: 10px; } </style>
  <div class="wrapper">
    <span class="name">${!data.description ? "Tomas Pustelnik" : ""}</span>
    <h1 class="title">${data.title}</h1>
    ${data.description ? '<span class="tags">' + data.description + "</span>" : ""}
    <ul class="tags">${data.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
    <span class="link">pustelto.com</span>
  </div>
  </body>
</html>`;
}

async function createSocialImages() {
  console.log("SOCIAL IMAGES GENERATION STARTED...");
  const browser = await puppeteer.launch();

  try {
    const data = await getData();
    const page = await browser.newPage();
    const imagesFolderPath = path.join(__dirname, "_site/images/share");

    if (!fs.existsSync(imagesFolderPath)) {
      await fsp.mkdir(imagesFolderPath);
    }

    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2,
    });

    // Fill the template with data and create screenshot
    for (imageData of data) {
      const content = await createTemplate(imageData);

      await page.setContent(content, {
        waitUntil: "domcontentloaded",
      });

      // Wait until all images and fonts have loaded
      await page.evaluate(async () => {
        const selectors = Array.from(document.querySelectorAll("img"));
        await Promise.all([
          document.fonts.ready,
          ...selectors.map((img) => {
            // Image has already finished loading, let’s see if it worked
            if (img.complete) {
              // Image loaded and has presence
              if (img.naturalHeight !== 0) return;
              // Image failed, so it has no height
              throw new Error("Image failed to load");
            }
            // Image hasn’t loaded yet, added an event listener to know when it does
            return new Promise((resolve, reject) => {
              img.addEventListener("load", resolve);
              img.addEventListener("error", reject);
            });
          }),
        ]);
      });

      // Take a screenshot of the page
      image = await page.screenshot({
        quality: 90,
        path: path.join(
          imagesFolderPath,
          (imageData.filename || imageData.title.toLowerCase().split(" ").join("-")) + ".jpg"
        ),
      });
    }
    console.log("SOCIAL IMAGES SUCCESSFULLY GENERATED");
  } catch (e) {
    console.log("SOCIAL IMAGES ERROR:", e);
  } finally {
    await browser.close();
    return;
  }
}

module.exports = createSocialImages;
