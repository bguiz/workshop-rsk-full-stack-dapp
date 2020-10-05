const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfig = {
  mode: 'development',
  entry: {
    dapp: './client/dapp.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './client/dapp.css',
          to: 'dapp.css',
        },
        {
          from: './client/index.html',
          to: 'index.html',
        },
      ],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
  },
};

module.exports = webpackConfig;
