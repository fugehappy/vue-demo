$(function() {
    var result = {
        "name": "BeJson",
        "url": "http://www.bejson.com",
        "page": 88,
        "isNonProfit": true,
        "address": {
            "street": "科技园路.",
            "city": "江苏苏州",
            "country": "中国"
        },
        "links": [
            {
                "name": "Google",
                "url": "http://www.google.com"
            }
        ],
        "xAxis": ["201701", "201702", "201703", "201704", "201705", "201706", "201707"],
        "series": [
            {
                name: "最高流量",
                type: "line",
                data: [11, 11, 15, 13, 12, 13, 10]
            },
            {
                name: "最低流量",
                type: "line",
                data: [1, 7, 2, 5, 3, 2, 0]
            }
        ]
    }
    var e = echarts.init(document.getElementById("echarts-line-chart"))
      , a = {
        title: {
            text: "未来一周气温变化"
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ["最高流量", "最低流量"]
        },
        grid: {
            x: 40,
            x2: 40,
            y2: 24
        },
        calculable: !0,
        xAxis: [{
            type: "category",
            boundaryGap: !1,
            data: result.xAxis
        }],
        yAxis: [{
            type: "value",
            axisLabel: {
                formatter: "{value} 人"
            }
        }],
        series: result.series
    };
    e.setOption(a);
    // $(window).resize(e.resize);
});

