const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  devtool: process.env.NODE_ENV === "development" ? "inline-source-map" : "",
  entry: {
    application: "./dist/src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  target: 'node',
  plugins: [
    new MiniCssExtractPlugin({
      filename: "application.css"
    }),
    new CopyWebpackPlugin([{
        from: "node_modules/govuk-frontend/assets/images",
        to: "images"
      },
      {
        from: "node_modules/govuk-frontend/assets/fonts",
        to: "fonts"
      },
      {
        from: "node_modules/govuk-frontend/assets/images/favicon.ico",
        to: "."
      }
    ])
  ],
  module: {
    rules: [{
        test: /\.scss$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  }
}