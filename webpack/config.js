const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const { entry, html, distPath, publicPath } = require('../expose')
const webpackOutputPath = path.join(distPath, publicPath)
module.exports = {
  entry: entry,
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  output: {
    path: webpackOutputPath,
    publicPath: publicPath,
    filename: '[contenthash].js',
    chunkFilename: '[contenthash].js'
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({}),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ]
  },
  module: {
    rules: [{
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: require.resolve('file-loader'),
      options: {
        outputPath: 'img',
        publicPath: '../img',
        useRelativePath: false,
        name: '[contenthash].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: require.resolve('file-loader'),
      options: {
        outputPath: 'fonts',
        publicPath: '../fonts',
        useRelativePath: false,
        name: '[contenthash].[ext]'
      }
    }, {
      test: /\.html$/,
      loader: require.resolve('html-loader'),
      options: {
        minimize: true
      }
    }, {
      test: /render.pug$/,
      use: [{
        loader: require.resolve('pug-loader')
      }]
    }, {
      test: /template.pug$/,
      use: [{
        loader: require.resolve('html-loader'),
        options: {
          minimize: {
            collapseBooleanAttributes: true
          }
        }
      }, {
        loader: require.resolve('pug-html-loader'),
        options: {
          doctype: 'html'
        }
      }]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        require.resolve('cache-loader'),
        require.resolve('thread-loader')
      ]
    }, {
      test: /module\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true,
          modules: {
            namedExport: true
          }
        }
      }, {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            namedExport: true,
            localIdentName: '__[hash:base64:5]'
          },
          importLoaders: 1
        }
      }]
    }, {
      test: /\.css$/,
      exclude: /module\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true
        }
      }, {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1
        }
      }]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[contenthash].css',
      chunkFilename: 'css/[contenthash].css'
    }),
    new HtmlWebpackPlugin(Object.assign({}, html, {
      inject: true,
      template: require('html-webpack-template'),
      filename: './index.html',
      alwaysWriteToDisk: true
    })),
    new HtmlWebpackHarddiskPlugin()
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new CleanWebpackPlugin({
    root: distPath,
    cleanOnceBeforeBuildPatterns: [distPath]
  }))
}
