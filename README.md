# Node.js 爬虫

- 爬取租房网站上的信息


示例图如下 （12.29 更新）

![](crawler/示例图/租房爬虫.jpg)

1. 使用 **Node.js** 爬取一些租房网站的信息， DB 都为 **JSON**
2. 构造后端，建立好读取 DB 的 **API**，由于是自己使用，跨域问题设定 **response.setHeader** 解决（应该用 **JSONP** 传输更安全）
3. 使用 [Echarts](http://echarts.baidu.com/) 渲染页面，可视化数据

- 使用说明

1. 在项目文件夹下运行 cmd，安装 yarn
   > ```yarn install```
2. 运行 crawler.js 爬取租房网信息
   > ```node crawler.js```
3. 爬取完成后，运行 app.js ，开启服务器
   > ```node app.js```
4. 打开 index.html 就可以看到渲染的图标

最后，这是一个给老妈用的东西...如果你有需要，请自行更改爬取地址...
