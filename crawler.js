// 几个工具
const log = console.log.bind(console)

const request = require('sync-request')

const cheerio = require('cheerio')
// 存储类
class Room {
    constructor() {
        // 网站名称、房源名称、信息、价格、连接、缩略图
        this.webName = ''
        // this.name = ''
        this.shape = ''
        this.area = ''
        this.price = 0
        this.url = ''
        this.coverUrl = ''
    }
}
// 元素获取
const roomFromLianjia = (div) => {
    let e = cheerio.load(div)
    let room = new Room()
    room.webName = '链家网'
    room.shape = e('.zone').find('span').text()
    room.area = e('.meters').text()
    room.price = e('.price').find('span').text()
    room.url = e('.pic-panel').find('a').attr('href')
    room.coverUrl = e('.lj-lazy').attr('src')
    // log(room.coverUrl)
    return room
}

// url 加速获取(需要缓存时使用)
// const cachedUrl = (url) => {
//     // 缓存名称
//     let index = url.split('/').slice(-1)
//     if (index == '') {
//         // log('index为空')
//         let cacheFile = 'cached_html/' + 'index-1.html'
//     } else {
//         // log(index)
//         let cacheFile = 'cached_html/' + index
//     }
//     // 判断是从缓存读取，还是网页读取
//     let fs = require('fs')
//     let exists = fs.existsSync(cacheFile)
//     if (exists) {
//         // log('文件存在')
//         let data = fs.readFileSync(cacheFile)
//         return data
//     } else {
//         // log('文件不存在')
//         let r = request('GET', url)
//         let body = r.getBody('utf-8')
//         fs.writeFileSync(cacheFile, body)
//         return body
//     }
// }
// 从 url 获取 room 信息

// url 获取 rooms
const roomsFromLianjia = (url) => {
    // 从缓存获取
    // html body
    // let body = cachedUrl(url)
    // let e = cheerio.load(body)
    let r = request('GET', url)
    let body = r.getBody('utf-8')
    let e = cheerio.load(body)
    let divs = e('#house-lst')
    let roomDivs = divs.find('li')
    let rooms = []
    for (var i = 0; i < roomDivs.length; i++) {
        let div = roomDivs[i]
        let m = roomFromLianjia(div)
        rooms.push(m)
    }
    return rooms
}
// 存信息
const saveRoom = (rooms, web) => {
    // 格式化
    let s = JSON.stringify(rooms, null, 2)
    let fs = require('fs')
    let path = `db/${web}.json`
    fs.writeFileSync(path, s)
    log('json存储完成')
}
// 下载图片
const downloadCovers = (rooms) => {
    // 使用 request 库来下载图片
    let request = require('request')
    let fs = require('fs')
    for (var i = 0; i < rooms.length; i++) {
        let r = rooms[i]
        let url = r.coverUrl
        let web = r.webName
        let shape = r.shape
        let area = r.area
        // 保存图片的路径
        let path = `covers/${web}/${shape}${area}.jpg`
        // 下载并且保存图片的套路
        request(url).pipe(fs.createWriteStream(path))
    }
    log('图片下载完成')
}
// 入口
var __main = () => {
    var rooms = []
    var urlLianjia = 'https://tj.lianjia.com/zufang/rs%E6%99%A8%E5%85%89%E6%A5%BC/'
    // for (i = 1; i <= 10; i++) {
    //     if (i == 1) {
    //         url = 'http://www.mtime.com/top/movie/top100/'
    //     } else {
    //         url = `http://www.mtime.com/top/movie/top100/index-${i}.html`
    //     }
    //     var moviesInPage = moviesFromUrl(url)
    //     movies = [...movies, ...moviesInPage]
    // }
    var roomsInLianjia = roomsFromLianjia(urlLianjia)
    rooms = [...rooms, ...roomsInLianjia]
    saveRoom(rooms, '链家网')
    // downloadCovers(rooms)
}

__main()
