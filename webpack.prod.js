const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: buildPath
  },
  module: {
    rules: [
      {
        test: [/.js$/],
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      hash: true,
      filename: 'index.html',
      chunks: ['index'],
      meta: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        description: 'Official splash page for DIADOZ',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@diadozofficial',
        'twitter:creator': '@reece_doz',
        'og:title': { property: 'og:title', content: 'DIADOZ' },
        'og:url': { property: 'og:url', content: 'http://www.diadoz.com/' },
        'og:image': { property: 'og:image', content: 'http://www.diadoz.com/' },
        'og:description': {
          property: 'og:description',
          content: 'Official splash page for DIADOZ'
        },
        'og:type': { property: 'og:type', content: 'website' }
      },
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new CopyWebpackPlugin([
      {
        from: './src/assets',
        to: 'assets'
      }
    ])
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      // new UglifyJsPlugin({}),
      new OptimizeCssAssetsPlugin({})
    ]
  }
};
