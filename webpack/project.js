// The highest level config. In most cases, this is the only file that would need to change within or across projects.

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const template_hwp = require.resolve("./lib/templates/default_index.ejs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Here you can configure pages, bundles, sourcemaps, and any other project specific config.

// PAGES CREATION //

const pagesConfig = env => {
  // Allow multi page/entry apps.
  // Although, we are mentioning chunks here, they will only be created if we mention them in bundleConfig in the next section.
  return [
    {
      title: "Home page",
      filename: `${"" && "" + "/"}index.html`,
      entry: { app: [path.join(env.PROJECT_PATH, env.SRC, "index.js")] },
      chunks: ["app", "manifest", "vendor", "common"],
      template: template_hwp
    },
    {
      title: "Another page",
      filename: `${"a" && "a" + "/"}index.html`,
      entry: { another: [path.join(env.PROJECT_PATH, env.SRC, "another.js")] },
      chunks: ["another", "manifest", "vendor", "common"],
      template: template_hwp
    },
    {
      title: "React page",
      filename: `${"r" && "r" + "/"}index.html`,
      entry: {
        react_demo:
          env.NODE_ENV === "production"
            ? [path.join(env.PROJECT_PATH, env.SRC, "react_demo.js")]
            : [
                "react-hot-loader/patch",
                path.join(env.PROJECT_PATH, env.SRC, "react_demo.js")
              ]
      },
      chunks: ["react_demo", "manifest", "vendor", "common"],
      template: template_hwp
    }
  ];
};
const pageCreation = env =>
  merge([
    // this format allows us to comment any page
    createPage(pagesConfig(env)[0])
    //createPage(pagesConfig(env)[1]),
    //createPage(pagesConfig(env)[2]),
  ]);

// BUNDLE EXTRACTION. HIGHLY project dependent optimization is needed in bundlesConfig below.

const isVendor = ({ resource }) => {
  return (
    resource && resource.indexOf("node_modules") >= 0 && resource.match(/\.js$/)
  );
};
const isLib = ({ resource }, libname) => {
  // If module has a path, and inside of the path exists the name "somelib",
  // and it is used in 3 separate chunks/entries, then break it out into
  // a separate chunk with chunk keyname "my-single-lib-chunk", and filename "my-single-lib-chunk.js"
  return resource && libname.test(resource);
}; // you can provide path too: (/react/) or (/node_modules\/react/)
// Bundle extraction is used only in production case.

const bundlesConfig = env => {
  console.log(env);
  return [
    {
      name: "vendor",
      chunks: ["app", "another", "react_demo"],
      minChunks: module => isVendor(module) && !isLib(module, /react-dom/)
    },
    {
      name: "common",
      minChunks: (module, count) => count >= 2 && !isVendor(module)
    },
    {
      name: "manifest",
      minChunks: Infinity
    }
  ];
};

// LOADER RESOLUTION //

const loaderResolution = () =>
  merge([
    {
      resolveLoader: {
        alias: {
          "demo-loader": path.resolve(__dirname,"./lib/loaders/demo-loader.js")
        }
      }
    }
  ]);

// SOURCEMAPS //

const smaptypes = ["(none)", "cheap-module-eval-source-map", "source-map"];
const sourcemapsType = { development: smaptypes[0], production: smaptypes[0] }; // make a choice here
const sourceMaps = env =>
  merge([
    {
      //     output: {
      // uncomment if needed
      //     devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]"
      //  },
      devtool: sourcemapsType[env.NODE_ENV]
    }
  ]);

module.exports.projectBaseConfig = env =>
  merge([loaderResolution(), pageCreation(env), sourceMaps(env)]);
module.exports.projectBundleExtraction = env =>
  merge([extractBundles(bundlesConfig(env))]);

const createPage = page => ({
  entry: page.entry,
  plugins: [new HtmlWebpackPlugin(page)]
});

const extractBundles = bundles => ({
  plugins: bundles.map(
    bundle => new webpack.optimize.CommonsChunkPlugin(bundle)
  )
});
