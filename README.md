# Node.js 爬虫


- 爬取租房网站上的信息
- 示例图如下 （12.29 更新）

![租房爬虫](https://github.com/Crayoncyann/crawler/blob/master/screenshots/crawler.gif)


## 基本功能

1. 获取一些租房网站信息
2. 图标可视化


## 构造过程

1. 基于 **Node.js**, **Express**, **cheerio**, **sync-request** 搭建后端
- 配置静态路径
- 配置 DB(JSON)
- 配置路由
- 配置 API
- 配置表头, 解决跨域问题
  > ```response.setHeader("Access-Control-Allow-Origin", "*")```

- 配置地址(选择本地8000端口)
2. 使用 **JavaScript** 渲染页面
- 原生 JavaScript 封装 AJAX
- 获取数据
- 使用 [Echarts](http://echarts.baidu.com/) 渲染页面，可视化数据


## 使用说明

1. 在项目文件夹下运行 cmd, 安装 yarn
   > ```yarn install```
2. 运行 crawler.js 爬取租房网信息
   > ```node crawler.js```
3. 待爬取完成后, 运行 app.js, 开启服务器
   > ```node app.js```
4. 打开项目路径下的 index.html, 就可以看到渲染的图表


最后, 这是一个给老妈用的东西 ... 如果你有需要, 请自行更改爬取地址...
