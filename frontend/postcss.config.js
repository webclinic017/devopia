module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: ['csv-loader']
      }
    ]
  }
};
