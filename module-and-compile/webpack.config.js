const path = require('path');

const config = {
  entry: './src/main.ts',
  mode: "development",
  devtool: "cheap-source-map",
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [{test: /\.ts$/, use: 'ts-loader'}],
  },
  output: {
    path: path.resolve(__dirname, './dist-webpack'),
    filename: '[name].js',
  },
  optimization: {
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    splitChunks: {
      chunks: 'async',
      minSize: 8,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

module.exports = [
  config,
  {
    ...config,
    entry: {
      'main-with-no-dep': './src/main-with-no-dep.ts'
    },
  },
  {
    ...config,
    entry: {
      'define-custom': './src/define-custom/index.ts'
    }
  },
  {
    ...config,
    entry: './src-common-js/main.js',
    output: {
      path: path.resolve(__dirname, './dist-webpack-js'),
    }
  }
]
