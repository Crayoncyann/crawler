// 基于准备好的 dom，初始化 echarts 实例
var element = document.querySelector('#main4')

var myChart4 = echarts.init(element)

// template 4
var template = (name, color) => {
    myChart4.setOption(
        {
            title: {
                text: `${name}`
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: `${color}`
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : []
                }
            ],
            yAxis: [
                {
                    type : 'value'
                }
            ]
        }
    )
}

var apiPrice = (path) => {
    apiGet(path, (r) => {
        let result = []
        r = JSON.parse(r)
        for (var i = 0; i < r.length; i++) {
            let price = r[i].price
            result.push(price)
        }
        log('价格', result)
        myChart4.setOption(
            {
                series: [
                    {
                        name: r.webName,
                        type: 'line',
                        stack: '价格',
                        areaStyle: {normal: {}},
                        data: result,
                    },
                ]
            }
        )
    })
}

var apiInfo = (path) => {
    apiGet(path, (r) => {
        let result = []
        r = JSON.parse(r)
        for (var i = 0; i < r.length; i++) {
            let shape = r[i].shape
            let area = r[i].area
            let info = area + ' ' + shape
            result.push(info)
        }
        log('信息', result)
        myChart4.setOption(
            {
                xAxis: [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : result,
                    }
                ],
            }
        )
    })
}

// 渲染
var setConfig = (path, name, color) => {
    template(name, color)
    apiPrice(path)
    apiInfo(path)
}

// 入口
var __main = () => {
    var path = 'http://localhost:8000/all/Zhongyuan'
    setConfig(path, '中原地产', '#A1CFE4')
}

__main()
