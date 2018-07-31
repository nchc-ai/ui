const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackStrip = require('strip-loader'); // remove all console.log
const CleanWebpackPlugin = require('clean-webpack-plugin'); // clean before build
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// 移除console.log
const JxsLoader = [
  'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-1',
  WebpackStrip.loader('debug', 'console.log')
];
// module.exports = content => removeUseStrict(content, { force: true });

module.exports = {
  mode: 'production',
  entry: [
    'babel-polyfill',
    path.join(__dirname, 'app/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
      }
    },
    noEmitOnErrors: true
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),  //縮小化要角，不過似乎不支援es6 ??
    new ExtractTextPlugin('style.css', {
      allChunks: false
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin(
      ['dist'],
      {
        root: __dirname,
        verbose: true,
        dry: false
      }
    )
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0', 'react-hmre']
        }
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: JxsLoader
      }, {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // compiles Sass to CSS
          }
        ]
      }, {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }, {
        test: /\.(ico|eot|woff|woff2|ttf|svg|png|jpg|gif)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        loader: 'url-loader?limit=3000'
      }
    ]
  }
};

