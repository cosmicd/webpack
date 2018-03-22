const path = require("path");
const merge = require("webpack-merge");
const ssr_entry = "ssrApp.js";
module.exports.ssrConfig = env =>
  merge([
    {
      entry: {
        index: [path.join(env.PROJECT_PATH, env.SRC, ssr_entry)]
      },
      output: {
        path: path.join(env.PROJECT_PATH, env.STATIC),
        filename: "[name].js",
        libraryTarget: "umd"
      },
      watchOptions: {
        aggregateTimeout: 300, //before reload, timeout after a file changes
        poll: 2000,
        ignored: [env.NODE_MODULES]
        //ignored: "files/**/*.js"
      }
    },
    loadJavaScript({
      include: [path.join(env.PROJECT_PATH, env.SRC, ssr_entry)],
      exclude: env.NODE_MODULES,
      options: {
        cacheDirectory: false
      }
    })
  ]);

const loadJavaScript = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: [
          {
            loader: "babel-loader",
            options
          }
        ]
      }
    ]
  }
});
