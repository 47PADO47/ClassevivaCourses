const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const fs = require('fs');

const files = [];

fs.readdirSync('./src/courses')
  .map(f => path.join(__dirname, 'src/courses', f))
  .forEach(f => files.push(f));

module.exports = {
  entry: [path.join(__dirname, './src/index.ts')].concat(files),
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    preferRelative: true,
    plugins: [new TsconfigPathsPlugin({
      configFile: './tsconfig.json',
      extensions: ['.ts', '.js']
    })]
  },
  output: {
    filename: 'loader.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: process.env.NODE_ENV || 'development',
};