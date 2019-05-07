const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //更改打包后文件内容--------????---------
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //打包后分离css文件
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //打包后压缩css文件？？？？

const config = {
  //   entry: "./src/index.js", //入口
  entry: {
    // app: "./src/index.js"
    // print: "./src/print.js"
    //多个入口：index和another两个入口，打包build后就会在index.html中引入两个script文件来引入他们两个
    index: "./src/index.js"
    // another: "./src/another-module.js"
  },
  //出口3c7d0c83
  output: {
    // filename: "bundle.js"
    // filename: "[name].bundle.js", //暂时不明白意思;;[name]代表的是entry中的key：app，print
    filename: "[name].[hash:8].js",
    chunkFilename: "[name].bundle.js", //懒加载和按需加载打包出来的文件名称
    path: path.resolve(__dirname, "dist"),
    publicPath: "/" //webpack-dev-middleware用到了?publicPath 也会在"服务器脚本"用到，以确保文件资源能够在 http://localhost:3030 下正确访问,为服务器提供访问地址------------????-----------
  },
  //   devtool: "inline-source-map", //inline-source-map不用于生产环境
  devtool: "source-map", //生产环境source-map，显示为原始源代码
  //   webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。让我们设置以下：
  // 修改配置文件，告诉开发服务器(dev server)，在哪里查找文件；而且告诉配置server的端口是多少，默认是8080
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    hot: true, //实现模块热替换
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: "../",
              hmr: process.env.NODE_ENV === "development",
              reloadAll: true
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), //CleanWebpackPlugin清楚dist内的全部文件，配置的时候内部什么都不传，然后用HtmlWebpackPlugin重新创建打包后的文件
    //重新创建打包后的文件
    new HtmlWebpackPlugin({
      // title: "Output Management",
      // title: "Code Splitting",
      title: "Caching",
      inject: true //默认就是true，意思是js引入到html的底部，如果是false则引入到head里
      //template: "./index.html",//这个就是依据哪个html作为打包后的html模板
    }),
    //CommonsChunkPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。让我们使用这个插件，将之前的示例中重复的 lodash 模块去除：
    // webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead. // 官网还未更新。。。。。
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "common"
    // }),
    new webpack.NamedModulesPlugin(), //实现模块热替换
    new webpack.HotModuleReplacementPlugin(), //实现模块热替换
    //分离css文件
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].[hash:8].css"
    }),
    new OptimizeCssAssetsPlugin() //实现普通压缩
  ],

  // 将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。让我们使用这个插件，将之前的示例中重复的 lodash 模块去除：
  // --------------好像需要写多入口，而且是入口文件中引用的才可以？？？？？？--------------
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         name: "commons", // 生成的工作组件的名字
  //         chunks: "initial", //chunks 有三个可选值，”initial”, “async” 和 “all”. 分别对应优化时只选择初始的chunks，所需要的chunks 还是所有chunks 。
  //         minChunks: 2 //至少有几个文件引用了同一个组件
  //       }
  //     }
  //   }
  // },

  //   stats: { children: false } //？？？解决打包是，下面打印显示 Entrypoint undefined = index.html错误问题，不过打包后html对js的应用不全问题仍存在，但是html在浏览器启动的时候所有js都可以正常工作，此处不明白为什么js没有加进去但是可以用呢？？？？？？？？？？？？？？
  mode: "production" //从 webpack 4 开始，也可以通过 "mode" 配置选项轻松切换到压缩输出，只需设置为 "production"。
};

module.exports = config;
