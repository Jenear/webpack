# test demo

```
"watch": "webpack --watch",
webpack --watch,watch 的功能是npm启动之后会一直监测，如果发现文件有改动，他会直接改动打包后文件，但是他不能完成浏览器的自动刷新，只是打包文件

```

# 自动刷新浏览器

```
"start": "webpack-dev-server --open",
启动之后会启动服务，默认的是localhost:8080下建立服务，然后修改页面保存，浏览器会自动刷新
--open是直接打开浏览器
而且可以在webpack.config.js 中去配置：
devServer: {
    contentBase: path.join(__dirname, "dist"),// 修改配置文件，告诉开发服务器(dev server)，在哪里查找文件；
    compress: true,//一切服务都启用gzip 压缩，或者在package.json 中的start上加上--compress-->"start": "webpack-dev-server --open --compress",
    port: 9000//更改端口
  },
```

```
模块热替换
是 webpack 提供的最有用的功能之一
"start": "webpack-dev-server --open --hotOnly",
--hotOnly 自己测试的结果是：加了只打印更新，如果不加浏览器上页面也会跟着更新（更新速度有些慢，等待一下）
启用此功能实际上相当简单。而我们要做的，就是更新 webpack-dev-server 的配置，和使用 webpack 内置的 HMR 插件。
* 好像直接刷新了整个页面，这是一个问题吗？？？？？？？？？？
```

# tree shaking

```

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。
但是需要webpack 的 compiler 提供提示哪些代码是“纯粹部分”。
这种方式是通过 package.json 的 "sideEffects" 属性来实现的。
详情：https://www.webpackjs.com/guides/tree-shaking/
{
  "name": "your-project",
  "sideEffects": false
}
```

```
配置不同的环境，production，development，test一般三种环境，webpack官网给出来的是写多个webpack来实现的，目前不知道怎么配置------不会-------
可以提供定义常量的方法：
project文件中定义环境
{env: process.env.NODE_ENV || 'development',}
引入project，然后取process.env
const __DEV__ = project.env === 'development';
const __TEST__ = project.env === 'test';
const __PROD__ = project.env === 'production';
但是还不太清楚怎么用
 new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
```

# 两个入口：

```
entry: {
// app: "./src/index.js"
// print: "./src/print.js"
//多个入口：index 和 another 两个入口，打包 build 后就会在 index.html 中引入两个 script 文件来引入他们两个
index: "./src/index.js",
another: "./src/another-module.js"
},

//打包后index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Code Splitting</title>
  </head>
  <body>
    <script type="text/javascript" src="/index.bundle.js"></script>
    <script type="text/javascript" src="/another.bundle.js"></script>
  </body>
</html>
```

# 防止重复(prevent duplication)

## 提取重复引用的组件到公共文件中

```
至少有两个文件引用同一个组件的时候使用
在webpack中的配置：
optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",// 生成的工作组件的名字
          chunks: "initial",//chunks 有三个可选值，”initial”, “async” 和 “all”. 分别对应优化时只选择初始的chunks，所需要的chunks 还是所有chunks 。
          minChunks: 2//至少有几个文件引用了同一个组件
        }
      }
    }
  },
  对应的文件大小都减小，增加一个commons.js文件，
  比如：index.js和another.js原来打包出来的差不多都是77kb，现在他们可能只有1.5kb，commons.js大小是76kb，整体减少了打包文件占用空间
```

# 动态导入(dynamic imports)

```
第一种，也是优先选择的方式是，使用符合 ECMAScript 提案 的 import() 语法。第二种，则是使用 webpack 特定的 require.ensure。
 import() 根据官网上的例子实现了把lodash打包后放到单独的js中
```

# 懒加载或者按需加载

```
懒加载或者按需加载，是一种很好的优化网页或应用的方式。
这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。
这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载.

官网案例成功
```

# 缓存

- 新技能：如果下次打包和上次打包时文件未改动，打包之后 hash 值不改变，也就是说文件名不改变；
- 而且如果这次打包时代码和之前的某次代码一样时，打包出来的 hash 值也和那次的 hash 值一样，就是说文件名一样

```
浏览器本身具有缓存机制，如果新的文件名和旧的文件名都一样，浏览器就不会去拿新 的文件，直接用旧的，现在主要是为了清除缓存而解决，运用名字加hash值来实现


```

# 分离和压缩 css

- 分离 css：mini-css-extract-plugin
- 压缩 css:

#问题：

- 1：dist 文件中每次更改文件都会创建两个 json 文件，------------不懂---------
- 2：dist 文件夹中 会创建 map 文件，为什么？运用了 source map 生成的
- 3：mini-css-extract-plugin 未实现 css 代码分离出来

```
  使用mini-css-extract-plugin 未实现css代码分离；所以 css 压缩使用了 optimize-css-assets-webpack-plugin；
  引入 uglifyjs-webpack-plugin 去压缩 js.
```

# webpack 优化：

1：实现按需加载/懒加载，也是运用了 import() 实现，等到调用的时候才会加载，初次不会加载进来，而且也有可能会出现某个文件一直都不会被加载的情况
2：动态导入：import()
3：提取重复引用的组件到公共文件中，防止重复加载，这样文件整体会变小
4:优化 Loader 配置------使用配置项 include 与 exclude 尽可能高概率命中文件，减少 webpack 匹配文件的时间。
5：tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。
