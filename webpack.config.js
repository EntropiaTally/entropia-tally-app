const path = require("path");
const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    render: "./src/ui2",
    overlay: "./src/overlay",
  },
  output: {
    path: path.resolve(__dirname, "public/scripts"),
    filename: "[name].bundle.js",
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
    alias: {
     '@components': path.resolve(__dirname, 'src/ui/components'),
     '@pages': path.resolve(__dirname, 'src/ui/pages'),
     '@uiUtils': path.resolve(__dirname, 'src/ui/utils'),
     '@utils': path.resolve(__dirname, 'src/utils'),
    }
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
