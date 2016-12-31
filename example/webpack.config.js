module.exports = {
  entry: './index.js',
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          minimize: true
        }
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  output: {
    filename: 'dist/bundle.js'
  }
};
