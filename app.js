// 引入 Express、body-parser、fs
const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const fs = require('fs')

app.use(bodyParser.json())

const loadRooms = (roomFilePath) => {
    var content = fs.readFileSync(roomFilePath, 'utf8')
    var rooms = JSON.parse(content)
    return rooms
}

const info = {
    'Lianjia': loadRooms('db/链家网.json'),
    'Wuba': loadRooms('db/58同城.json'),
    'Ganji': loadRooms('db/赶集网.json'),
    'Zhongyuan': loadRooms('db/中原地产.json'),
    'Douban': loadRooms('db/豆瓣租房小组.json'),
}

const sendHtml = (path, response) => {
    var options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
}

const sendJSON = (response, data) => {
    var r = JSON.stringify(data, null, 2)
    // 解决跨域问题
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.send(r)
}

app.get('/', (request, response) => {
    var path = 'index.html'
    var options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
})

app.get('/all/Lianjia', (requrest, response) => {
    sendJSON(response, info.Lianjia)
})

app.get('/all/58', (requrest, response) => {
    sendJSON(response, info.Wuba)
})

app.get('/all/Ganji', (requrest, response) => {
    sendJSON(response, info.Ganji)
})

app.get('/all/Zhongyuan', (requrest, response) => {
    sendJSON(response, info.Zhongyuan)
})

app.get('/all/Douban', (requrest, response) => {
    sendJSON(response, info.Douban)
})

const server = app.listen(8000, () => {
    let host = server.address().address
    let port = server.address().port
    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
