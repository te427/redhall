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
      events: path.resolve  (__dirname, 'src/events/'),
      helpers: path.resolve  (__dirname, 'src/helpers/'),
      managers: path.resolve(__dirname, 'src/managers/'),
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