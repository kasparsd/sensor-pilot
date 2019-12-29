const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env, options) => {
  const serviceWorkerExclude = []

  // Don't cache HTML files to enable hot-reloading.
  if (options.mode !== 'production') { // Is there a better way of checking for the "mode" flag?
    serviceWorkerExclude.push(/\.html$/)
  }

  return {
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/template.html',
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        importWorkboxFrom: 'local',
        offlineGoogleAnalytics: true,
        exclude: serviceWorkerExclude,
      }),
      new CopyPlugin([
        {
          from: 'src/assets/',
          to: 'assets/',
        },
      ]),
    ],
  }
}
