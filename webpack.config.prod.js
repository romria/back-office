const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const commonConfig = require('./webpack.config.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  output: {
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                namedExport: false,
                localIdentName: '[name][local][hash:base64:3]',
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  performance: {
    // Vendor chunk is large by nature (React + deps) and is long-term cached —
    // exclude it from the asset size check so only app code is measured.
    assetFilter: (name) => !name.includes('vendor'),
  },
  optimization: {
    // Extract webpack runtime into its own tiny chunk so vendor/app hashes
    // stay stable across builds that only touch one of them.
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        // All node_modules into one vendor chunk — long-term cacheable since
        // deps change far less frequently than app code.
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      "...",
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {quality: 80, progressive: true},
              png: {compressionLevel: 9, palette: true},
              webp: {quality: 80, reductionEffort: 6},
              gif: {effort: 4, loop: 0},
              // avif: {quality: 70, speed: 5},
            },
          },
        },
      }),
    ],
  },
  plugins: [
    ...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
    }),
  ],
});
