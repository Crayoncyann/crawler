// log
const log = console.log.bind(console)

// ajax
const ajax = function(request) {
    let r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            request.callback(r.response)
        }
    }
    if (request.method == 'GET') {
        r.send()
    } else {
        request.data = JSON.stringify(request.data)
        r.send(request.data)
    }
}

// api
const apiGet = (path, callback) => {
    var request = {
        url: path,
        method: 'GET',
        callback: callback,
    }
    ajax(request)
}
