const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");

module.exports.devConfig = env =>
  merge([
    {
      output: {
        filename: "[name].bundle.js", // this is required even for devserver serving bundle from memory
        publicPath: env.ASSET_PATH_DEV
      },
      watchOptions: {
        aggregateTimeout: 300, //before reload, timeout after a file changes
        poll: 2000,
        ignored: [env.NODE_MODULES]
        //ignored: "files/**/*.js"
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
      ]
    },
    runWebpackDevServer({
      host: env.HOST,
      port: env.PORT,
      hot: true,
      contentBase: [path.join(env.PROJECT_PATH, env.BUILD)], // Could be a list of paths.
      publicPath: env.ASSET_PATH_DEV, // Pick any name. This is the url the client side code uses for the bundle in memory.
      compress: false,
      setup(app) {
        // testing inline request-reponse
        app.get("/some/path", function(req, res) {
          res.json({ custom: "response2" });
        });
      }
    }),
    loadCSS()
  ]);

// loaders and plugins //

const runWebpackDevServer = ({
  host,
  port,
  hot,
  compress,
  contentBase,
  publicPath,
  setup
} = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    hot,
    compress,
    contentBase,
    publicPath,
    setup,
    overlay: {
      errors: true,
      warnings: true
    }
  }
});

const loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: ["style-loader", "css-loader"]
      }
    ]
  }
});
