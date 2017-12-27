var log = console.log.bind(console)
var request = require('sync-request')
var cheerio = require('cheerio')
// movie类
class Movie {
    constructor() {
        // 电影名、排名、评分、简介、封面图链接
        this.name = ''
        this.rank = 0
        this.score = 0
        this.synopsis = ''
        this.coverUrl = ''
    }
}
// moive里的元素获取
var movieFromDiv = (div) => {
    var e = cheerio.load(div)
    var movie = new Movie()
    var nameDiv = e('.pb6')
    movie.name = nameDiv.find('a').text()
    var rankDiv = e('.number')
    movie.rank = rankDiv.find('em').text()
    var score1 = e('.total').text()
    var score2 = e('.total1').text()
    movie.score = score1 + score2
    movie.synopsis = e('mt3').text()
    movie.coverUrl = e('.img_box').attr('src')
    return movie
}
// url获取方式
var cachedUrl = (url) => {
    // 缓存名称
    var index = url.split('/').slice(-1)
    if (index == '') {
        // log('index为空')
        var cacheFile = 'cached_html/' + 'index-1.html'
    } else {
        // log(index)
        var cacheFile = 'cached_html/' + index
    }
    // 判断是从缓存读取，还是网页读取
    var fs = require('fs')
    var exists = fs.existsSync(cacheFile)
    if (exists) {
        // log('文件存在')
        var data = fs.readFileSync(cacheFile)
        return data
    } else {
        // log('文件不存在')
        var r = request('GET', url)
        var body = r.getBody('utf-8')
        fs.writeFileSync(cacheFile, body)
        return body
    }
}
// 从url获取movie
var moviesFromUrl = (url) => {
    // html body
    var body = cachedUrl(url)
    var e = cheerio.load(body)
    // 遍历所有的movieDiv
    var divs = e('#asyncRatingRegion')
    var movieDivs = divs.find('li')
    var movies = []
    for (var i = 0; i < movieDivs.length; i++) {
        var div = movieDivs[i]
        var m = movieFromDiv(div)
        movies.push(m)
    }
    return movies
}
// 存movie
var saveMovie = (movies) => {
    var s = JSON.stringify(movies, null, 2)
    var fs = require('fs')
    var path = 'mtime.txt'
    fs.writeFileSync(path, s)
    log('mtime.txt完成')
}
// 下载图片
var downloadCovers = (movies) => {
    // 使用 request 库来下载图片
    var request = require('request')
    var fs = require('fs')
    for (var i = 0; i < movies.length; i++) {
        var m = movies[i]
        var url = m.coverUrl
        // 保存图片的路径
        var path = 'covers/' + m.rank + ' ' + m.name + '.jpg'
        // 下载并且保存图片的套路
        request(url).pipe(fs.createWriteStream(path))
    }
    log('图片下载完成')
}
var __main = () => {
    // 爬取时光网Top100
    var movies = []
    var url = ''
    for (i = 1; i <= 10; i++) {
        if (i == 1) {
            url = 'http://www.mtime.com/top/movie/top100/'
        } else {
            url = `http://www.mtime.com/top/movie/top100/index-${i}.html`
        }
        var moviesInPage = moviesFromUrl(url)
        movies = [...movies, ...moviesInPage]
    }
    saveMovie(movies)
    downloadCovers(movies)
}
__main()
