const path = require("path");
const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: "./src/render",
  output: {
    path: path.resolve(__dirname, "public/scripts"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
