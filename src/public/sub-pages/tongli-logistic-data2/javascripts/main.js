(function($, host, echarts) {
    'use strict';
    if (!(echarts && $)) {
        alert('eCharts or jQuery libraries are not loaded properly, program exit!');
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
                layoutSize: 1400,
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
                    // ALERT!!!! Code to format two special bar charts
                    var special_id = ["empty-top5", "loaded-top5"];
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
                        //// DANGEROUS!!! the backend returns 10 records where it should return 5 ONLY, thus this special code to pick last 5
                        data.series.data = data.series.data.length === 10 ? data.series.data.slice(4, 9) : data.series.data;
                        data.yAxis.data = updatedData.length === 10 ? updatedData.slice(4, 9) : updatedData;
                        //// END DANGEROUS!!!
                    }
                    // END ALERT!!!!                                                    

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
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '4%',
                top: '6%',
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
                data: []
            }]
        };

        // another setting template of bar-chart
        var barOptBase2 = $.extend(true, {}, barOptBase, {
            elId: 'full-top5',
            grid: {
                left: '-10%',
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

        var barOptBase3 = $.extend(true, {}, barOptBase, {
            elId: 'full-top5',
            grid: {
                left: '-15%',
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
                bottom: '3%',
                containLabel: true
            },
            series: [],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=4"
        };

        // setting template of a pie chart
        var pieOptBase = {
            elId: 'chechang',
            type: 'pie',
            color: ['#58C1DA', '#0BA1FC', '#41D5F2', '#ADDD8E', '#467EFF', '#FF7145', '#76FFE7', '#FFD376'],
            series: [{
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                label: {
                    normal: {
                        formatter: "{b} : {d}%",
                        fontSize: 13,
                        fontWeight: 'bold',
                        color: '#ffffff'
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
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=5"
        };

        // actual configurations of all charts on the page
        var the_config = {
            // add shadows to bars
            option_lenglian_frequent_bar: $.extend(true, {}, barOptBase, {
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=1"
            }),
            option_lingdan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'lingdan-frequent',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=2"
            }),
            option_juanyan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'juanyan-frequent',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=3"
            }),
            option_order_trends_line: $.extend(true, {}, lineOptBase, {
                elId: 'order-trends',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=4"
            }),
            option_chechang_pie: pieOptBase,
            option_empty_top5: $.extend(true, {}, barOptBase2, {
                elId: 'empty-top5',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=6"
            }),
            option_loaded_top5: $.extend(true, {}, barOptBase3, {
                elId: 'loaded-top5',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=7"
            })
        };

        return the_config;
    }

    // fetch data for china-map
    function setupMapSeries() {
        var coordsPromise = $.getJSON('javascripts/vendor/cn-provinces.json');
        var valuePromise = $.getJSON('http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=7');

        return $.when(coordsPromise, valuePromise).then(function(coordsResolved, valuesResolved) {
            return generateMapData(coordsResolved[0], valuesResolved[0].data);
        });
    }

    function generateMapData(coordsBase, values) {
        var points = [],
            lines = [];

        points = values.map(function(item) {
            var toName = item.valueText.split('-')[1].slice(0, 2);
            var rtn = {};

            try {
                rtn = {
                    name: toName,
                    value: coordsBase[toName].concat(item.valueLong)
                };
            } catch (e) {
                rtn = {};
            }

            return rtn;
        });

        lines = values.map(function(item) {
            var fromName = item.valueText.split('-')[0].slice(0, 2);
            var toName = item.valueText.split('-')[1].slice(0, 2);

            return {
                fromName: fromName,
                toName: toName,
                coords: getCoords([fromName, toName], coordsBase)
            }
        });

        return {
            points: points,
            lines: lines
        };
    }

    function getCoords(pair, coordsBase) {
        var fromName = pair[0];
        var toName = pair[1];

        try {
            return [coordsBase[fromName], coordsBase[toName]];
        } catch (e) {}
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
                            position: 'insideRight',
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
            legend: {
                data: series.map(function(item) {
                    return item[0].name;
                }),
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14,
                },
                padding: [30, 0, 0, 0],
                itemGap: 40,
                itemWidth: 60
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