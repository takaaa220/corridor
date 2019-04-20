const path = require("path"); // 絶対パスに変換するために
const htmlWebpackPlugin = require("html-webpack-plugin"); // index.htmlをビルドチェインの中で作っちゃう
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PrettierPlugin = require("prettier-webpack-plugin");

module.exports = {
  mode: "development",
  entry: [
    "./src/App.tsx", // エントリポイントの指定、src下に書いていくので　src/index.tsxにしとく
    "./src/stylesheets/application.scss"
  ],
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        // Linterを走らせる
        enforce: "pre", // ビルド前処理だよってこと
        loader: "tslint-loader", // tslint-loaderを使う
        test: /\.tsx?$/, // tslint-loaderに渡すファイルの正規表現。xxx.tsとxxx.tsxの正規表現。
        exclude: [
          // 渡さないファイル
          /node_modules/
        ],
        options: {
          emitErrors: true // これ設定しとくとTSLintが出してくれたwarningをエラーとして扱ってくれる、要するに-Wall
        }
      },
      {
        loader: "ts-loader", // ts-loaderを使う、こいつがトランスパイルしてくれる
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        options: {
          configFile: "tsconfig.dev.json" // TypeScriptのコンパイル設定ファイル
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"] // importの時に、これらの拡張子は解決してもらえる、要するにHoge.tsxをimport Hoge from './Hoge'みたいに書ける
  },
  output: {
    filename: "static/js/bundle.js", // 仕上がりファイルの置き場
    path: path.resolve(__dirname, "dist") // 出力ディレクトリの指定の絶対パス
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "index.html" // 同じ階層にあるindex.htmlを元に、デプロイ用のindex.htmlを作って出力ディレクトリに配置してくれる
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css"
    }),
    new PrettierPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 3000,
    open: true
  }
};
