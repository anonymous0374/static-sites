(function($, host, echarts) {
    'use strict';
    if (!(echarts && $)) {
        alert('eCharts or jQuery libraries are not loaded properly, program exit!');
        return;
    }

    var config = getConfigTemplate(); // get basic configs of all charts on this page
    var charts = []; // eChart instances
    var counters = []; // counter instances
    var counters = [{
        elId: 'vehicle-sum',
        elClass: 'num',
        value: 972207
    }];

    $(function() {
        // generate 3 counter modules
        generateCounterModules(counters);

        // generate map separately, and generate only once        
        setupMapSeries().then(generateMap);

        generateCharts();
        setInterval(generateCharts, 10000);
        setInterval(function() { // refresh the whole page
            location.reload(true);
        }, 1000 * 60 * 10);

    });

    function generateMap(data) {
        var mapOptBase = {
            elId: 'china_map',
            backgroundColor: 'transparent',
            geo: {
                map: 'china',
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(1, 101, 204, 0.7)',
                        borderColor: '#404a59',
                        borderWidth: 1
                    }
                },
                layoutCenter: ['50%', '60%'],
                layoutSize: 1000,
                selectedMode: true,
                regions: [{
                    name: '四川',
                    itemStyle: {
                        normal: {
                            areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#30A6EF'
                            }, {
                                offset: 1,
                                color: '#0091EB'
                            }], false),
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff;',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '广东',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 168, 226)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '云南',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 127, 213)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '广西',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 215, 226)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '河南',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(125, 205, 189)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '湖南',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 212, 170)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '贵州',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(125, 205, 189)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '浙江',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 168, 226)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '江苏',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 127, 213)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '重庆',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 215, 226)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    name: '山东',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(0, 215, 226)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }]
            },
            series: [{
                name: '地点',
                type: 'effectScatter',
                effectType: 'ripple',
                showEffectOn: 'render',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    period: 4,
                    scale: 4,
                    brushType: 'stroke'
                },
                label: {
                    emphasis: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbol: 'pin',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#46bee9'
                    }
                },
                data: data.points.map(function(item) {
                    item.symbol = 'circle';
                    item.symbolSize = 10;
                    item.itemStyle = {
                        normal: {
                            color: '#ff6666'
                        }
                    };

                    return item;
                })
            }, {
                name: '线路',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 1,
                effect: {
                    show: true,
                    constantSpeed: 100,
                    symbol: 'pin',
                    symbolSize: 15,
                    trailLength: 0
                },
                lineStyle: {
                    normal: {
                        color: '#05FBC4', // 飞行图标
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: data.lines
            }]
        };
        var chart = echarts.init($('#china_map')[0]);
        chart.setOption(mapOptBase);
    }

    function generateCounterModules(configs) {
        $(configs).each(function(index, config) {
            play(config.elId, config.elClass, config.value);
        });
    }

    // fetch data and initialize charts after DOM is ready for manipulation
    function generateCharts() {
        $(charts).each(function(index, item) {
            // item.dispose();
            item.clear();
        });

        generateCounterModules(counters);

        $(Object.keys(config)).each(function(index, key) {
            (function() {
                var chart = {};
                var promise = $.ajax({
                    url: config[key].url
                });
                var $chart = $('#' + config[key].elId);
                if ($chart.length > 0) { // check if element exists for safty
                    chart = echarts.init($chart[0]);
                    charts.push(chart); // closure
                } else {
                    console.log('cannot find element for the chart: ' + config[key].elId);
                    return;
                }

                promise.then(function(rsp) {
                    return dataResolved(rsp, config[key].type);
                }).then(function(data) {
                    var option = config[key];
                    chart.setOption(option, false, true);
                    chart.setOption(data, false, true);
                });

            }());
        });
    }

    /////////////////////  CONFIGURATIONS BELOW //////////////////////////////////////////////

    // specific configurations for each chart
    function getConfigTemplate() {
        // basic settings of bar-charts
        var barOptBase = {
            elId: 'yearly-everage-matching-time',
            type: 'bar',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '4%',
                top: 0,
                bottom: '60',
                containLabel: true
            },
            yAxis: [{
                type: 'category',
                showTitle: false,
                data: [1, 1, 1, 1],
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff'
                },
                axisLine: {
                    show: false
                }
            }],
            xAxis: [{
                type: 'value',
                axisLabel: {
                    color: '#3398DB'
                },
                axisTick: {
                    show: false
                },
                show: false
            }],
            series: [{
                type: 'bar',
                barWidth: '50%',
                itemStyle: {
                    normal: {
                        barBorderRadius: [0, 80, 80, 0],
                        color: new echarts.graphic.LinearGradient(
                            1, 0, 0, 0, [{
                                offset: 0,
                                color: '#83bef6'
                            }, {
                                offset: 0.5,
                                color: '#188df0'
                            }, {
                                offset: 1,
                                color: '#188df0'
                            }]
                        )
                    }
                },
                data: [1, 1, 1, 1]
            }]
        };

        // setting template of a pie chart
        var pieOptBase = {
            elId: 'vehicle-types',
            type: 'pie',
            // color: ['#58C1DA', '#0BA1FC', '#41D5F2', '#ADDD8E', '#467EFF', '#FF7145', '#76FFE7', '#FFD376'],
            series: [{
                name: '解决状态',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                label: {
                    normal: {
                        // formatter: "{b} : {d}%",
                        fontSize: 13,
                        fontWeight: 'bold',
                        // normal: {
                        color: function(params) {
                                var colorList = [
                                    ['#FBDA61', '#F76B1C'],
                                    ['#B4ED50', '#429321'],
                                    ['#12F2d4', '#008223'],
                                    ['#F5515F', '#9F031B'],
                                    ['#12FBD0', '#0082D2'],
                                    ['#F5E658', '#DF6A10'],
                                    ['#86F9A8', '#177C35'],
                                    ['#5BA4F0', '#271A5D'],
                                    ['#9044E6', '#380C7B'],
                                    ['#4E3EEC', '#180884'],
                                ];
                                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    color: colorList[params.dataIndex][0],
                                    offset: 0
                                }, {
                                    color: colorList[params.dataIndex][1],
                                    offset: 1,
                                }], false)
                            }
                            // }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function(idx) {
                    return Math.random() * 200;
                }
            }],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=2"
        };

        // setting template of line-charts
        var lineOptBase = {
            elId: 'vehicle-hourly-flow',
            color: ['pink', 'green', 'yellow', 'grey'],
            type: 'line',
            xAxis: {
                type: 'category',
                axisLine: {
                    color: '#ffffff;',
                    opacity: 0.16
                },
                axisLabel: {
                    color: 'white',
                    opacity: 0.7
                },
                // name: 'x',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ffffff;',
                        opacity: 0.16
                    }
                },
                axisTick: {
                    show: false
                },
                data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#ffffff;',
                        opacity: 0.16
                    }
                },
                axisLabel: {
                    color: 'white',
                    opacity: 0.7
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: [],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=5"
        };

        // actual configurations of all charts on the page
        var the_config = {
            option_vtype_pie: $.extend(true, {}, pieOptBase),
            option_vlength_pie: $.extend(true, {}, pieOptBase, {
                elId: 'vehicle-length',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=3"
            }),
            option_vflow_hourly_line: lineOptBase,
            option_vflow_weekly_line: $.extend(true, {}, lineOptBase, {
                elId: 'vehicle-weekly-flow',
                url: 'http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=6'
            }),
            option_vflow_monthly_line: $.extend(true, {}, lineOptBase, {
                elId: 'vehicle-monthly-flow',
                url: 'http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=7',
                xAxis: {
                    data: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // month
                }
            }),
        }

        the_config.option_vflow_monthly_line.xAxis.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // hourly
        the_config.option_vflow_weekly_line.xAxis.data = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期七'] // weekday

        return the_config;
    }

    // fetch data for china-map
    function setupMapSeries() {
        var coordsPromise = $.getJSON('javascripts/vendor/indexed-city-coords.json');
        var valuePromise = $.getJSON('http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=7');

        return $.when(coordsPromise, valuePromise).then(function(coordsResolved, valuesResolved) {
            return generateMapData(coordsResolved[0], valuesResolved[0].data);
        });
    }

    function generateMapData(coordsBase, values) {
        var points = [],
            lines = [];

        if (!$.isArray(values)) {
            values = values[0].concat(values[1]).concat(values[-1]);
        }

        lines = values.map(function(item) {
            var fromName = item.valueText.split('-')[0].slice(0, 2);
            var toName = item.valueText.split('-')[1].slice(0, 2);

            return {
                fromName: fromName,
                toName: toName,
                coords: getCoords([fromName, toName], coordsBase)
            }
        });

        points = resortPoints(lines, coordsBase);

        return {
            points: points,
            lines: lines
        };
    }

    // sort out points from lines, and set all value to 1
    function resortPoints(lines, coordsBase) {
        var points = [];

        $(lines).each(function(index, line) {
            if (points.indexOf(line.fromName) === -1) {
                points.push({
                    name: line.fromName,
                    value: line.coords[0].concat(1)
                });
            }
            if (points.indexOf(line.toName) === -1) {
                points.push({
                    name: line.toName,
                    value: line.coords[1].concat(1)
                });
            }
        });

        return points;
    }

    function getCoords(pair, coordsBase) {
        var fromName = pair[0];
        var toName = pair[1];

        try {
            return [getCoord(fromName, coordsBase), getCoord(toName, coordsBase)];
        } catch (e) {}
        return [
            [],
            []
        ];
    }

    function getCoord(city, coordsBase) {
        var i = 0,
            len = coordsBase.index.length;

        for (i = 0; i < len; i += 1) {
            if (coordsBase.index[i].startsWith(city, 0)) {
                return coordsBase.coords[i];
            }
        }

        console.log('cannot find coordinates for: ' + city);
        return [
            [],
            []
        ];
    }

    // data promise status-change event handlers
    function barDataResolved(rsp) {
        var response = [];
        var option = {}; // option relayed upon response
        var series = [];
        var yAxis = [];

        try {
            response = JSON.parse(rsp).data;
            $(response).each(function(index, item) {
                series.splice(0, 0, item.valueLong);
                // series.push(item.valueLong);
                yAxis.push(item.valueText);
            });

            option = {
                yAxis: {
                    data: yAxis
                },
                series: {
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff',
                            position: 'inside'
                        }
                    },
                    data: series
                }
            };
        } catch (e) {
            console.log(e);

        }

        return option;
    }

    function barDataFailed(e) {
        console.log(e);
    }

    function pieDataResolved(rsp) {
        var response = [];
        var option = {}; // option relayed upon response
        var series = [];

        try {
            response = JSON.parse(rsp).data;
            response = response.slice(0, 5);
            $(response).each(function(index, item) {
                series.push({
                    name: item.valueText,
                    value: item.valueLong
                });
            });

            option = {
                series: {
                    data: series
                }
            };
        } catch (e) {
            console.log(e);

        }


        return option;
    }

    function pieDataFailed(e) {
        console.log(e);
    }

    function lineDataResolved(rsp) {
        var response = [];
        var option = {}; // option relayed upon response
        var series = [];
        var yAxis = [];

        try {
            response = JSON.parse(rsp).data;
            if ($.isArray(response)) { // means it has only 1 line
                var option = {
                    series: []
                }
                series = response.map(function(item) {
                    return {
                        type: 'line',
                        data: response.map(function(item) {
                            return Number(item.valueLong.replace(',', ''));
                        })
                    };
                });

                option.series = series;

                return option;
            } else {
                $(Object.keys(response)).each(function(index, key) {
                    var series_i = response[key].sort(function(item1, item2) {
                        var num1 = parseInt(item1.valueText),
                            num2 = parseInt(item2.valueText);
                        return num1 - num2;
                    });

                    // special code to insert null as value to represent no-value of that month
                    // 12 months as xAxis
                    $([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).each(function(index, item) {
                        if (!findValueOnXAxis(item, series_i)) {
                            series_i.splice(index, 0, {
                                valueText: index + 1,
                                valueLone: null
                            });
                        }
                    });

                    series.push({
                        type: 'line',
                        data: series_i
                    });

                });
            }

        } catch (e) {
            console.log('exception occurred! ' + e.toString());
        }

        $(Object.keys(series)).each(function(index, key) {
            var selectedArr = series[key].data.map(function(item) {
                return item.valueLong;
            });

            series[key] = selectedArr;
        });

        option = {
            series: series.map(function(arr) {
                return {
                    type: "line",
                    data: arr
                };
            })
        };

        return option;
    }

    function lineDataFailed(e) {

    }

    function dataResolved(rsp, chartType) {
        switch (chartType) {
            case 'bar':
                {
                    return barDataResolved(rsp);
                }
            case 'line':
                {
                    return lineDataResolved(rsp);
                }
            case 'pie':
                {
                    return pieDataResolved(rsp);
                }
            default:
                {
                    return {};
                }
        }

    }

    function play(elId, elClass, num) {
        var threshold = 10;
        var html = '';
        var arr = String(num).split('');
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i] == '.') {
                html += "."
                continue;
            }

            html += '<div style="background-image: url(images/number-frame.png); margin-right: 10px;" id="' + elId + '_' + i + '" class="' + elClass + '" data-id="' + i + '">';
            html += retuen10(threshold);
            html += '</div>';
        }

        document.querySelector("#" + elId).innerHTML = html;
        var num = document.querySelectorAll("." + elClass);
        var spanHeight = num[0].querySelector('span').offsetHeight;
        var numlen = num.length;
        for (var j = 0; j < numlen; j++) {
            var newi = document.createElement('i')
            newi.innerHTML = arr[num[j].getAttribute("data-id")];
            num[j].querySelector("span").appendChild(newi);

            $(num[j].querySelector("span")).css('transition', 'all ' + (.9 + j * .1) + 's ease-in .1s');
            $(num[j].querySelector("span")).css('transform', 'translate3d(0,-' + spanHeight + 'px,0)');

        }
    }

    function retuen10(showingNumber) {
        var html = ''
        html += "<span>"
        for (var i = 0; i < showingNumber; i++) {
            for (var j = 0; j < 10; j++) {
                html += '<i>' + j + '</i>'
            }
        }
        html += "</span>"
        return html;
    }

    // helper functions
    function findValueOnXAxis(xAxis, objs) {
        var i = 0;
        var found = false;

        for (i = 0; i < objs.length; i += 1) {
            if (xAxis === parseInt(objs[i].valueText)) {
                found = true;
                break;
            }
        }

        return found;
    }


}(jQuery, window, echarts))