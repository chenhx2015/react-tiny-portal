// 生产环境配置
const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base");

const path = require("path");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(base, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "usePortal.js",
    library: 'reactPortal'
  },
  optimization: {
    minimize: true,
    minimizer: [
      //压缩CSS代码
      new OptimizeCss(),
      //压缩js代码
      new TerserPlugin({
        sourceMap: true,
        parallel: true,
      }),
    ],
  },
  plugins: [
    //使用插件定义全局变量DEV
    new webpack.DefinePlugin({
      DEV: JSON.stringify("production"),
    }),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
});
