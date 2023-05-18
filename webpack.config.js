const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  target: 'electron-renderer',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
        'fs': false, // disable fs module
        'os': require.resolve('os-browserify/browser'),
        'path': require.resolve('path-browserify'),
        'crypto': require.resolve('crypto-browserify'),
        'stream': require.resolve('stream-browserify'),
        'constants': require.resolve('constants-browserify'),
        'util': require.resolve('util/'),
        'assert': require.resolve('assert/'),
        'buffer': require.resolve('buffer/'),
      },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
        ]
      }
    ],
  },
  mode: 'development'
};