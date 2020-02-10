const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const DEV_CONFIG = {
  mode: "production",
  target: "web",
  entry: {
    analytics: path.resolve(__dirname, "./analytics.js")
  },
  output: {
    path: path.resolve(__dirname, "../../_site/js"),
    filename: "[name].js"
  },
  plugins: [
    new CopyPlugin([{ from: path.resolve(__dirname, "./copy-over"), to: "./", flatten: true }])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|copy-over)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              // preset modules must be in root package.json otherwise webpack will not pick them
              // during template rendering
              "@babel/preset-modules"
            ]
            // env: {
            //   modern: {
            //     presets: [
            //       "@babel/preset-modules"
            //     ]
            //   },
            //   legacy: {
            //     presets: [
            //       ["@babel/preset-env", {
            //         targets: {
            //           browsers: [
            //             'last 2 versions'
            //           ]
            //         },
            //         modules: false // Needed for tree shaking to work.
            //       }]
            //     ]
            //   }
            // }
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // exclude
        terserOptions: {
          ecma: 8,
          safari10: true
        }
      })
    ]
  }
};
const compiler = webpack(DEV_CONFIG);

module.exports = class {
  data() {
    return {
      eleventyExcludeFromCollections: true
    };
  }
  async render() {
    return await new Promise(resolve => {
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          const info = stats.toJson();
          console.error(err, "\n", info.errors);
          throw new Error("JS compilation failed");
        }
        console.log("JS compilation finished\n", stats.toString());
        return resolve();
      });
    });
  }
};
