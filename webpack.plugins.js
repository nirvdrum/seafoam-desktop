const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new DefinePlugin({
    __dirname: JSON.stringify(process.cwd()),
    __filename: JSON.stringify(""),
    global: "globalThis",
  }),
];
