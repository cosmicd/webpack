const webpack = require("webpack");
const merge = require("webpack-merge");
const glob = require("glob");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
//const CleanWebpackPlugin = require('clean-webpack-plugin');
//const GitRevisionPlugin = require('git-revision-webpack-plugin');
const BabelWebpackPlugin = require("babel-minify-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const bundleExtraction = require("../../project").projectBundleExtraction;

module.exports.prodConfig = env =>
  merge([
    {
      output: {
        chunkFilename: "[name].[chunkhash:8].js",
        filename: "[name].[chunkhash:8].js",
        publicPath: env.ASSET_PATH_PROD
        //jsonpFunction:'webpackJsonp',
      },
      performance: {
        hints: "warning", // 'error' or false are valid too
        maxEntrypointSize: 100000, // in bytes
        maxAssetSize: 450000 // in bytes
      },
      plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 1000
        }) // doesnt work with multiu-entry case.
      ],
      recordsPath: path.join(env.PROJECT_PATH, "records.json") // this file will be produced
    },
    //tasks.clean( ), // do not use! a small mistake could delete all files; better do it manually
    minifyJavaScript(),
    minifyCSS({
      options: {
        discardComments: {
          removeAll: true,
          // Run cssnano in safe mode to avoid
          // potentially unsafe transformations.
          safe: true
        }
      }
    }),
    bundleExtraction(env),
    //tasks.attachRevision(),
    extractCSS({
      use: ["css-loader", autoprefix()]
    }),
    purifyCSS({
      paths: glob.sync(`${path.join(env.PROJECT_PATH, env.SRC)}/**/*.js`, {
        nodir: true
      })
    })
  ]);

// loaders and plugins //

const extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: "[name].[contenthash:8].css" // always use this: one css file per entry
    //filename: 'style.[contenthash:8].css',  // if you want separate css for each input css file
    // if either the issuer js or the issued css code changes, both atre invalidated
    // filename: 'style.css' // output one css file; causes caching issues
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: plugin.extract({
            use,
            fallback: "style-loader"
          })
        }
      ]
    },
    plugins: [plugin]
  };
};

const autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    plugins: () => [require("autoprefixer")()]
  }
});

const purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })]
});

const minifyJavaScript = () => ({
  plugins: [new BabelWebpackPlugin()]
});

const minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
});

