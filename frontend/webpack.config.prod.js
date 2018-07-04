const path = require("path");
const webpack = require("webpack");
const JxsLoader = ["babel?presets[]=es2015&presets[]=react&presets[]=stage-1",WebpackStrip.loader("debug", "console.log")];


module.exports = {
  entry: [
    "babel-polyfill",
    path.join(__dirname, "app/main.js")
  ],
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react", "stage-0", "react-hmre"],
        },
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: JxsLoader,
      }, {
        test: /\.json?$/,
        loader: "json-loader",
      }, {
        test: /\.scss$/,
        loader: "style!css!sass",
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
      }, {
        test: /\.(ico|eot|woff|woff2|ttf|svg|png|jpg|gif)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        loader: "url-loader?limit=3000",
      },
    ],
  }
};