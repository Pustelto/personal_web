// Taken from https://github.com/google/eleventy-high-performance-blog/blob/60902bfdaf764f5b16b2af62cf10f63e0e74efbc/_data/isdevelopment.js
module.exports = function () {
  return /serve/.test(process.argv.join());
};
