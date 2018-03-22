// This module is used both in dev and prod cases.
const path = require("path");
const merge = require("webpack-merge");
const projectConfig = require("../../project");

module.exports.baseConfig = env =>
  merge([
    {
      output: {
        path: path.join(env.PROJECT_PATH, env.BUILD) //required for both dev and prod but webpack-devserver (dev case) does not use it.
      }
    },
    lintJavaScript({
      // configured in .eslintrc.js
      include: path.join(env.PROJECT_PATH, env.SRC),
      exclude: env.NODE_MODULES,
      options: {
        useEslintrc: true // use .eslintrc config file
      }
    }), //optional
    lintCSS({
      include: path.join(env.PROJECT_PATH, env.SRC),
      exclude: env.NODE_MODULES //options: will use .stylelintrc by default
    }), //optional
    loadFonts({
      //project specific
      options: {
        name: "[name].[hash:8].[ext]" // name of the output file; could prefix with a path
      }
    }),
    loadJavaScript({
      include: path.join(env.PROJECT_PATH, env.SRC),
      exclude: env.NODE_MODULES,
      options: {
        cacheDirectory: true
      }
    }),
    loadImages({
      options: {
        limit: 15000,
        name: "[name].[hash:8].[ext]"
      }
    }),
    projectConfig.projectBaseConfig(env)
  ]);

// loaders and plugins //

const lintJavaScript = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        enforce: "pre", // relates to order of loaders; pre means do liniting before tranforming code
        use: [
          {
            loader: "eslint-loader",
            options
          }
        ]
      }
    ]
  }
});

const lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: "pre", // relates to order of loaders; pre means do liniting before tranforming code
        use: [
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("stylelint")() // will use .stylelintrc by default
              ]
            }
          }
        ]
      }
    ]
  }
});

const loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,

        use: {
          loader: "file-loader",
          options
        }
      }
    ]
  }
});

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

const loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,

        use: {
          loader: "url-loader",
          options
        }
      }
    ]
  }
});
