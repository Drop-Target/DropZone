const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

let extractTextPlugin = new ExtractTextPlugin({
  filename: 'main.css',
  disable: false,
  allChunks: true,
});

const outputPath = `${__dirname}/dist`;

module.exports = () => {
  return {
    target: 'electron-main',
    entry: {
      app: ['babel-polyfill', './src/ts/index.ts'],
    },
    output: {
      filename: '[name].js',
      path: outputPath,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [{ loader: 'url-loader', options: { limit: 10000 } }],
        },
        {
          test: /\.scss/,
          loader: extractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  includePaths: ['node_modules'],
                },
              },
            ],
          }),
        },
      ],
    },
    plugins: [
      extractTextPlugin,
      new webpack.optimize.UglifyJsPlugin(),
      new CopyWebpackPlugin([
        { from: 'index.html', to: `${outputPath}/index.html` },
        // { from: './src/assets/images', to: `${outputPath}/assets/images` },
        // { from: './src/assets/fonts', to: `${outputPath}/assets/fonts` },
      ]),
    ],
  };
}
