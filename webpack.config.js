const path = require('path');

module.exports = {
  entry: './src/app.js',
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js' ],
    alias: {
      constants: path.resolve(__dirname, 'src/constants/'),
      managers: path.resolve(__dirname, 'src/managers/'),
      objects: path.resolve(__dirname, 'src/objects/'),
      scenes: path.resolve(__dirname, 'src/scenes/')
    }
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets/',
  },
  mode: 'development'
};