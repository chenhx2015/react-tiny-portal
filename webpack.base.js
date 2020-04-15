// 开发环境和生产环境的共有配置
// 生产环境配置
const path = require("path");
module.exports = {
  // entry: {
  //   vendor: ["react", "react-dom"],
  //   app: "./src/index.js",
  // },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    library: 'reactPortal'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
};
