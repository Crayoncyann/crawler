// 几个工具
const log = console.log.bind(console)

const request = require('sync-request')

const cheerio = require('cheerio')

// 存储类
class Room {
    constructor() {
        // 网站名称、房源名称、信息、价格、连接、缩略图
        this.webName = ''
        this.shape = ''
        this.area = ''
        this.price = 0
        this.url = ''
        this.coverUrl = ''
    }
}

// 链家网
const roomFromLianjia = (div) => {
    let e = cheerio.load(div)
    let room = new Room()
    room.webName = '链家网'
    room.shape = e('.zone').find('span').text().slice(0, -2)
    room.area = e('.meters').text().slice(0, -2)
    room.price = e('.price').find('span').text()
    room.url = e('.pic-panel').find('a').attr('href')
    return room
}

const roomsFromLianjia = (url) => {
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

// 58同城
const roomFrom58 = (div) => {
    let e = cheerio.load(div)
    let room = new Room()
    room.webName = '58同城'
    room.shape = e('.room').text().split(' ')[0]
    let areaDiv = e('.room').text().split(' ')
    room.area = areaDiv[areaDiv.length - 1].slice(4)
    room.price = e('.money').find('b').text()
    room.url = e('.img_list').find('a').attr('href')
    room.coverUrl = e('.img_list').find('a').find('img').attr('src')
    return room
}

const roomsFrom58 = (url) => {
    let r = request('GET', url)
    let body = r.getBody('utf-8')
    let e = cheerio.load(body)
    let divs = e('.listUl')
    let roomDivs = divs.find('li')
    let rooms = []
    for (var i = 0; i < roomDivs.length; i++) {
        let div = roomDivs[i]
        let m = roomFrom58(div)
        rooms.push(m)
    }
    return rooms
}

// 赶集网
const roomFromGanji = (div) => {
    let e = cheerio.load(div)
    let room = new Room()
    room.webName = '赶集网'
    let divs = e('.size').find('span').text()
    room.shape = divs
    room.area = ''
    room.price = e('.num').text()
    room.url = e('.title-font').attr('href')
    room.coverUrl = e('.js-lazy-load').attr('src')
    return room
}

const roomsFromGanji = (url) => {
    let r = request('GET', url)
    let body = r.getBody('utf-8')
    let e = cheerio.load(body)
    let divs = e('.f-list')
    let roomDivs = divs.find('.f-list-item')
    let rooms = []
    for (var i = 0; i < roomDivs.length; i++) {
        let div = roomDivs[i]
        let m = roomFromGanji(div)
        rooms.push(m)
    }
    return rooms
}

// 中原地产
const roomFromZhongyuan = (div) => {
    let e = cheerio.load(div)
    let room = new Room()
    room.webName = '中原地产'
    let divs = e('.house-name').find('span').text().split('|')
    room.shape = divs[1]
    room.area = divs[2]
    room.price = e('.price-nub').find('span').text()
    room.url = e('.house-title').find('a').attr('href')
    room.coverUrl = e('.lazy').attr('src')
    return room
}

const roomsFromZhongyuan = (url) => {
    let r = request('GET', url)
    let body = r.getBody('utf-8')
    let e = cheerio.load(body)
    let divs = e('.section')
    let roomDivs = divs.find('.house-item')
    let rooms = []
    for (var i = 0; i < roomDivs.length; i++) {
        let div = roomDivs[i]
        let m = roomFromZhongyuan(div)
        rooms.push(m)
    }
    return rooms
}

// 豆瓣租房小组(最近发布的东西)
const roomFromDouban = (div) => {
    let e = cheerio.load(div)
    let room = new Room()
    room.webName = '豆瓣租房小组'
    room.shape = e('.title').find('a').text()
    room.area = ''
    room.price = e('.time').text()
    room.url = e('.title').find('a').attr('href')
    room.coverUrl = ''
    return room
}

// 需要伪装一下
const { cookie, user_agent } = require('./doubanconfig.js')

const roomsFromDouban = (url) => {
    // 403 伪装登录
    // let r = request('GET', url)
    // let body = r.getBody('utf-8')
    let options = {
        'headers': {
            'user-agent': user_agent,
            'cookie': cookie,
        }
    }
    let res = request('GET', url, options)
    let body = res.getBody('utf8')
    let e = cheerio.load(body)
    let divs = e('.olt')
    let roomDivs = divs.find('tr')
    let rooms = []
    for (var i = 0; i < roomDivs.length; i++) {
        let div = roomDivs[i]
        let m = roomFromDouban(div)
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
    log(`${web} - (\´・ω・\`) 爬完啦`)
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

// 爬...
const crawlerLianjia = () => {
    let rooms = []
    let urlLianjia = 'https://tj.lianjia.com/zufang/rs%E6%99%A8%E5%85%89%E6%A5%BC/'
    let roomsInLianjia = roomsFromLianjia(urlLianjia)
    rooms = [...rooms, ...roomsInLianjia]
    saveRoom(rooms, '链家网')
    // downloadCovers(rooms)
}

const crawler58 = () => {
    let rooms = []
    for (var i = 1; i <= 39; i++) {
        let url = `http://tj.58.com/chuzu/pn${i}/?key=%E6%99%A8%E5%85%89%E6%A5%BC&PGTID=0d3090a7-0001-230f-db1b-bc9cf77171c4&ClickID=2`
        var roomsIn58 = roomsFrom58(url)
        rooms = [...rooms, ...roomsIn58]
    }
    saveRoom(rooms, '58同城')
    // downloadCovers(rooms)
}

const crawlerGanji = () => {
    let rooms = []
    for (var i = 1; i <= 6; i++) {
        let url = `http://tj.ganji.com/fang1/o${i}/_%E6%99%A8%E5%85%89%E6%A5%BC/`
        var roomsInGanji = roomsFromGanji(url)
        rooms = [...rooms, ...roomsInGanji]
    }
    saveRoom(rooms, '赶集网')
    // downloadCovers(rooms)
}

const crawlerZhongyuan = () => {
    let rooms = []
    let urlZhongyuan = 'http://tj.centanet.com/zufang/?key=%E6%99%A8%E5%85%89%E6%A5%BC'
    let roomsInZhongyuan = roomsFromZhongyuan(urlZhongyuan)
    rooms = [...rooms, ...roomsInZhongyuan]
    saveRoom(rooms, '中原地产')
    // downloadCovers(rooms)
}

const crawlerDouban = () => {
    let rooms = []
    let urlDouban = 'https://www.douban.com/group/69503/'
    let roomsInDouban = roomsFromDouban(urlDouban)
    rooms = [...rooms, ...roomsInDouban]
    saveRoom(rooms, '豆瓣租房小组')
    // downloadCovers(rooms)
}

// 入口
var __main = () => {
    // 爬爬爬...
    crawlerLianjia()
    crawler58()
    crawlerGanji()
    crawlerZhongyuan()
    crawlerDouban()
}

__main()
