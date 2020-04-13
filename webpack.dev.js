// 开发环境配置
const path = require("path");
//引入webpack-merge插件进行合并
const merge = require("webpack-merge");
//引入webpack.base.js文件
const base = require("./webpack.base");
//引入webpack
const webpack = require("webpack");

module.exports = merge(base, {
  entry: "./examples/index.js",
  output: {
    path: path.resolve(__dirname, "examples"),
    filename: "bundle.js",
  },
  mode: "development",
  devServer: {
    open: true,
    contentBase: "./examples",
    port: 8383,
    inline: true,
    hot: true,
  },
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      DEV: JSON.stringify("dev"),
    }),
  ],
});
