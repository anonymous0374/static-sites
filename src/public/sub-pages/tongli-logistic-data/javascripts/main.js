(function($, host, echarts) {
    if (!echarts) {
        alert('eChart library is not loaded properly, program exit!');
        return;
    }

    var env = {
        dev: {
            enabled: false,
            urlPrefix: 'http://localhost:3010'
        },
        test: {
            enabled: true,
            urlPrefix: 'http://statictest.tf56.com'
                // urlPrefix: ''
        },
        prod: {
            enabled: false,
            urlPrefix: 'http://data.tf56.com'
                // urlPrefix: ''
        },
        getUrlPrefix: function() {
            if (this.dev.enabled) {
                return this.dev.urlPrefix;
            } else if (this.test.enabled) {
                return this.test.urlPrefix;
            } else if (this.prod.enabled) {
                return this.prod.urlPrefix;
            }
        }
    };

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
                        borderWidth: 1,
                        color: 'rgba(51, 69, 89, .5)',
                        borderColor: 'rgba(100,149,237,1)'
                    }
                },
                layoutCenter: ['50%', '60%'],
                layoutSize: 1000,
                selectedMode: true,
                regions: [{ // an example region item
                    name: '云南',
                    label: {
                        normal: {
                            show: false,
                            color: '#ffffff',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    }
                }]
            },
            series: [{ // an example of a point item(will be overwrite by actual data)
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
                symbol: 'pin',
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: '#46bee9'
                    }
                },
                data: data.points.map(function(item) {
                    item.symbol = 'circle';
                    item.symbolSize = 10;
                    item.label = {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            fontSize: 13,
                            color: '#ffffff',
                            position: 'right'
                        }
                    };
                    item.itemStyle = {
                        normal: {
                            color: 'gold'
                        }
                    };

                    // UGLY SPECIAL CODE
                    if (item.name === '玉溪') {
                        item.itemStyle.normal.color = 'red';
                    }

                    if (item.name === '泸州') {
                        item.label.normal.position = 'left';
                    }
                    // UGLY SPECIAL CODE

                    return item;
                })
            }, { // an example of a line item(will be overwrite by actual data)
                name: '线路',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 1,
                effect: {
                    show: true,
                    constantSpeed: 60,
                    symbol: 'pin',
                    symbolSize: 10,
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

    // fetch data and initialize charts after DOM is ready for manipulation
    function generateCharts() {
        $(charts).each(function(index, item) {
            item.clear();
        });

        $(Object.keys(config)).each(function(index, key) {
            (function() {
                var chart = {};
                var promise = $.ajax({
                    url: config[key].url
                });
                var elId = config[key].elId;

                var $chart = $('#' + elId);
                if ($chart.length > 0) { // check if element exists for safty
                    for (var i = 0; i < charts.length; i += 1) {
                        if (charts[i].elId === elId) { // the chart instance has already been initialized before
                            chart = charts[i];
                            break;
                        }
                    }

                    if (!chart.elId) { // no such chart in charts yet
                        chart = echarts.init($chart[0]);
                        chart.elId = elId;
                        charts.push(chart);
                    }
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
                                        padding: option.elId == 'empty-top5' ? [-45, 0, 0, 10] : [-45, 0, 0, 10],
                                        align: 'left'
                                    }
                                };
                            });
                        data.yAxis.data = updatedData;
                    }

                    // special code for option_juanyan_req_trends, because it has only 7 months
                    if (key === 'option_juanyan_req_trends') {
                        var actual_data = data.series.slice(0, 7);
                        var actual_xaxis = data.xAxis.data.slice(0, 7);
                        data.series.data = actual_data;
                        data.xAxis.data = actual_xaxis;
                    }

                    if (key.indexOf('value_top10') !== -1) {
                        var actual_data = data.series.data.slice(10, 20);
                        var actual_yaxis = data.yAxis.data.slice(10, 20);
                        var actual_yaxis_reversed = [];

                        $(actual_yaxis).each(function(index, value) {
                            actual_yaxis_reversed.splice(0, 0, value);
                        });

                        data.series.data = actual_data.sort(function(num1, num2) {
                            return num1 - num2;
                        });
                        data.series.label.normal.formatter = "{c}";
                        data.series.itemStyle = {
                            normal: {
                                barBorderRadius: [80, 0, 0, 80],
                                color: new echarts.graphic.LinearGradient(
                                    1, 0, 0, 0, [{
                                        offset: 0,
                                        color: '#188df0'
                                    }, {
                                        offset: 0.5,
                                        color: '#188df0'
                                    }, {
                                        offset: 1,
                                        color: '#83bef6'
                                    }]
                                )
                            }
                        };
                        data.yAxis.data = actual_yaxis_reversed;

                    } else if (key.indexOf('value_bottom10') !== -1) {
                        var actual_data = data.series.data.slice(0, 10);
                        var actual_yaxis = data.yAxis.data.slice(0, 10);
                        data.series.data = actual_data;
                        data.series.label.normal.formatter = "{c}";
                        data.yAxis.data = actual_yaxis;
                    }
                    // end special code
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
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 'bold'
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
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=1"
        };

        // another type of bar-chart
        var barOptBaseFull = $.extend(true, {}, barOptBase, {
            elId: 'full-top5',
            grid: {
                left: '-12%',
                top: '10%',
                containLabel: true
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 'bold'
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
            },
            url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=7'
        });

        // the third bar config base
        var barOptBaseEmpty = $.extend(true, {}, barOptBase, {
            elId: 'empty-top5',
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
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 'bold'
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
            },
            url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=8'
        });

        // setting template of line-charts
        var lineOptBase = {
            color: ['#72e5f5', '#fd9929', '#f8e71c', '#29fd70'],
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
            series: [],
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=4"
        };

        // actual configurations of all charts on the page
        var config = {
            option_lenglian_frequent_bar: $.extend(true, {}, barOptBase),
            option_juanyan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'juanyan-frequent',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=3"
            }),
            option_lingdan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'lingdan-frequent',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=4"
            }),
            option_shiweice_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'shiweice-frequent',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=2"
            }),
            option_order_trends_line: $.extend(true, {}, lineOptBase, {
                elId: 'order-trends',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=5"
            }),
            option_juanyan_req_trends: $.extend(true, {}, lineOptBase, {
                elId: 'juanyan-req-trends',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=6"
            }),
            option_full_top5: barOptBaseFull,
            option_empty_top5: $.extend(true, {}, barOptBaseEmpty, {
                elId: 'empty-top5',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=8"
            }),
            option_juanyan_routine_value_top10: $.extend(true, {}, barOptBase, {
                elId: 'juanyan-routine-value-top',
                grid: {
                    left: '8%',
                    top: '6%',
                    bottom: '0',
                    containLabel: true
                },
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
                url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=9'
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
                },
                url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=9'
            })
        };

        return config;
    }

    // fetch data for china-map
    function setupMapSeries() {
        var coordsPromise = $.getJSON('javascripts/vendor/indexed-city-coords.json');
        var valuePromise = $.getJSON(env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData1?type=10');

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
            var fromNameOriginal = item.valueText.split('-')[0];
            var fromName = fromNameOriginal.slice(0, 2);
            var toNameOriginal = item.valueText.split('-')[1];
            var toName = toNameOriginal.slice(0, 2);

            return {
                fromName: fromNameOriginal,
                toName: toNameOriginal,
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
            if ($.isArray(response)) {
                // response = JSON.parse(rsp).data
            } else {
                var keys = Object.keys(JSON.parse(rsp).data);
                var response = [];
                $(keys).each(function(index, key) {
                    response = JSON.parse(rsp).data[key].concat(response);
                });
            }

            $(response).each(function(index, item) {
                var valueInNumber = /\%$/.test(item.valueLong) ?
                    Number(item.valueLong.slice(0, item.valueLong.length - 1)) :
                    Number(item.valueLong);
                series.push(valueInNumber);
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
                            color: '#ffffff',
                            formatter: "{c}%"
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

    // function barDataResolvedFor

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
                padding: [20, 0, 0, 0],
                itemGap: 20,
                itemWidth: 30,
                icon: 'rect'
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