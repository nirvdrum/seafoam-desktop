const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const webpack = require("webpack");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

// Add a banner to inject __dirname and __filename polyfills
plugins.push(
  new webpack.BannerPlugin({
    banner: "var __dirname = ''; var __filename = ''; var global = globalThis;",
    raw: true,
    entryOnly: false,
  })
);

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      querystring: false,
      util: false,
      http: false,
      https: false,
      stream: false,
      url: false,
      buffer: false,
      assert: false,
      events: false,
    },
  },
  node: {
    __dirname: false,
    __filename: false,
    global: false,
  },
};
