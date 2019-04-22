const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    player: './src/player.js'
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      vue$: 'vue/dist/vue.esm.js'
    }
  },

  devtool: false,

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true }
        }
      })
    ]
  },

  plugins: [new VueLoaderPlugin(), new BundleAnalyzerPlugin()]
};
