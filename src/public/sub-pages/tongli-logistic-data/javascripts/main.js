(function($, host, echarts) {
    if (!echarts) {
        alert('eChart library is not loaded properly, program exit!');
        return;
    }

    var config = getConfigTemplate(); // get basic configs of all charts on this page
    var charts = []; // eChart instances


    $(function() { // refresh the charts
        // generate map separately, and generate only once
        setupMapSeries().then(generateMap);
        generateCharts();
        setInterval(generateCharts, 10000);
        setInterval(function() {
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
                            areaColor: 'rgb(0, 215, 226)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#ffffff;',
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                            fontSize: 24,
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
                symbol: 'circle',
                symbolSize: 20,
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
                zlevel: 2,
                effect: {
                    show: true,
                    constantSpeed: 30,
                    symbol: 'arrow',
                    symbolSize: 15,
                    trailLength: 0
                },
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ffffff'
                        }, {
                            offset: 0.5,
                            color: '#188df0'
                        }, {
                            offset: 1,
                            color: '#F58158'
                        }], false),
                        width: 4,
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

    // fetch data and initialize charts after DOM is ready for manipulation
    function generateCharts() {
        $(charts).each(function(index, item) {
            item.chart.clear();
        });

        $(Object.keys(config)).each(function(index, key) {
            (function() {
                var chart = {};
                var promise = $.ajax({
                    url: config[key].url
                });
                var $chart = $('#' + config[key].elId);
                if ($chart.length > 0) { // check if element exists for safty
                    chart = echarts.init($chart[0]);
                    charts.push({ // closure
                        chartId: config[key].elId,
                        chart: chart
                    });
                } else {
                    console.log('cannot find element for the chart: ' + config[key].elId);
                    return;
                }

                promise.then(function(rsp) {
                    return dataResolved(rsp, config[key].type);
                }).then(function(data) {
                    var option = config[key];
                    // Code to format two special bar charts
                    var special_id = ["empty-top5", "full-top5"];
                    if (special_id.indexOf(option.elId) !== -1) {
                        var updatedData =
                            data.yAxis.data.map(function(item) {
                                return {
                                    value: item,
                                    textStyle: {
                                        fontSize: 12,
                                        color: 'white',
                                        padding: [-45, 0, 0, 10],
                                        align: 'left'
                                    }
                                };
                            });
                        //// backend returns 10 records where it should return 5 ONLY, thus this special code to pick last 5
                        data.series.data = data.series.data.length === 10 ? data.series.data.slice(4, 9) : data.series.data;
                        data.yAxis.data = updatedData.length === 10 ? updatedData.slice(4, 9) : updatedData;
                        //// 
                    }

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
            elId: 'leng-lian-frequent',
            type: 'bar',
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '8%',
                top: '2%',
                bottom: '0',
                containLabel: true
            },
            yAxis: [{
                type: 'category',
                showTitle: false,
                data: [],
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
                barWidth: '65%',
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
                data: []
            }],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=1"
        };

        // another type of bar-chart
        var barOptBase2 = $.extend(true, {}, barOptBase, {
            elId: 'full-top5',
            grid: {
                left: '-8%',
                top: '10%',
                containLabel: true
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff;'
                },
                axisLine: {
                    show: false
                },
                data: []
            },
            series: {
                type: 'bar',
                barWidth: '40%',
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
                data: []
            }
        });

        // setting template of line-charts
        var lineOptBase = {
            color: ['#3398DB'],
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
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
                bottom: '0',
                top: '30%',
                containLabel: true
            },
            series: [{
                type: 'line',
                data: []
            }, {
                type: 'line',
                lineStyle: {
                    normal: {
                        color: 'pink'
                    }
                },
                data: []
            }, {
                type: 'line',
                lineStyle: {
                    normal: {
                        color: 'green'
                    }
                },
                data: []
            }],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=4"
        };

        // actual configurations of all charts on the page
        var config = {
            option_lenglian_frequent_bar: $.extend(true, {}, barOptBase),
            option_juanyan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'juanyan-frequent',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=3"
            }),
            option_lingdan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'lingdan-frequent',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=4"
            }),
            option_shiweice_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'shiweice-frequent',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=2"
            }),
            option_order_trends_line: $.extend(true, {}, lineOptBase, {
                elId: 'order-trends',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=5"
            }),
            option_juanyan_req_trends: $.extend(true, {}, lineOptBase, {
                elId: 'juanyan-req-trends',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=6"
            }),
            option_full_top5: barOptBase2,
            option_empty_top5: $.extend(true, {}, barOptBase2, {
                elId: 'empty-top5',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=8"
            }),
            option_juanyan_routine_value_top10: $.extend(true, {}, barOptBase, {
                elId: 'juanyan-routine-value-top',
                xAxis: [{
                    type: 'value',
                    inverse: true,
                    axisLabel: {
                        color: '#3398DB'
                    },
                    axisTick: {
                        show: false
                    },
                    show: false
                }],
                grid: {
                    left: '8%',
                    top: '6%',
                    bottom: '0',
                    containLabel: true
                },
                yAxis: {
                    type: 'category',
                    showTitle: false,
                    position: 'right',
                    data: [],
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#ffffff'
                    },
                    axisLine: {
                        show: false
                    }
                },
                series: [{
                    type: 'bar',
                    barWidth: '70%',
                    itemStyle: {
                        normal: {
                            barBorderRadius: [80, 0, 0, 80],
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
                    data: []
                }]
            }),
            option_juanyan_routine_value_bottom10: $.extend(true, {}, barOptBase, {
                elId: 'juanyan-routine-value-bottom',
                grid: {
                    left: '8%',
                    top: '6%',
                    bottom: '0',
                    containLabel: true
                },
                yAxis: {
                    type: 'category',
                    showTitle: false,
                    data: [],
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#ffffff'
                    },
                    axisLine: {
                        show: false
                    }
                }
            })
        };

        return config;
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
                var actualValue = item.valueLong.endsWith('%') ?
                    Number(item.valueLong.slice(0, item.valueLong.length - 1)) :
                    Number(item.valueLong.replace(',', ''));

                series.splice(0, 0, actualValue);
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
                            position: 'inside',
                            color: '#ffffff'
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
            // each key represents a series of data of one line in the chart
            // and sort data of each line by valueText(which represents month)
            $(Object.keys(response)).each(function(index, key) {
                var series_i = response[key].sort(function(item1, item2) {
                    var num1 = parseInt(item1.valueText),
                        num2 = parseInt(item2.valueText);
                    return num1 - num2;
                });

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
                    data: series_i.map(function(item) {
                        item.name = key;
                        return item;
                    })
                });
            });
        } catch (e) {
            console.log('exception occurred!');
        }

        $(Object.keys(series)).each(function(index, key) {
            var selectedColumns = series[key].data.map(function(item) {
                return {
                    name: item.name,
                    value: item.valueLong
                };
            });

            series[key] = selectedColumns;
        });

        option = {
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
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            legend: {
                data: series.map(function(item) {
                    return item[0].name;
                }),
                textStyle: {
                    color: '#ffffff',
                    fontSize: 13
                },
                padding: [30, 0, 0, 0],
                itemGap: 20,
                itemWidth: 30
            },
            series: series.map(function(arr) {
                return {
                    type: "line",
                    name: arr[0].name,
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    },
                    data: arr
                };
            })
        };

        return option;
    }

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

}(jQuery, window, echarts))