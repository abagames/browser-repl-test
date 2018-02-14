const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: ["./src/index.ts"],
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules", "web_modules"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|web_modules)/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  externals: {
    "matter-js": "Matter"
  },
  plugins: [
    new CleanWebpackPlugin(["docs"]),
    new HtmlWebpackPlugin({
      title: "browser-repl-test"
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "matter-js",
          entry: "https://unpkg.com/matter-js@0.14.1/build/matter.min.js",
          global: "Matter"
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
