(function($, host, echarts) {
    'use strict';
    if (!(echarts && $)) {
        alert('eCharts or jQuery libraries are not loaded properly, program exit!');
        return;
    }

    var config = getConfigTemplate(); // get basic configs of all charts on this page
    var charts = []; // eChart instances

    $(function() { // refresh the charts
        generateCharts();
        setInterval(generateCharts, 10000);

        setInterval(function() {
            location.reload(true);
        }, 1000 * 60 * 10);

    });

    // fetch data and initialize charts after DOM is ready for manipulation
    function generateCharts() {
        $(charts).each(function(index, item) {
            // item.dispose();
            item.clear();
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
                    charts.push(chart); // closure
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
                left: '-25%',
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
                left: '-30%',
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
                bottom: '3%',
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

        // setting template of a pie chart
        var pieOptBase = {
            elId: 'chechang',
            type: 'pie',
            series: [{
                hoverAnimation: true,
                radius: [60, 80],
                type: 'pie',
                selectedMode: 'single',
                selectedOffset: 16,
                clockwise: true,
                startAngle: 90,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 18,
                            color: '#999'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: '#999'
                        }
                    }
                },
                data: [{
                    value: 5,
                    name: '10米以上',
                    color: '#00abf3;'
                }, {
                    value: 15,
                    name: '2~4米',
                    color: '#00abf3;'
                }, {
                    value: 25,
                    name: '4~6米',
                    color: '#00abf3;'
                }, {
                    value: 35,
                    name: '6~8米',
                    color: '#00abf3;'
                }, {
                    value: 5,
                    name: '2米以下',
                    color: '#00abf3;'
                }]
            }],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=5"
        };

        // setting template of a map chart
        var mapOptBase = {
            elId: 'china_map',
            backgroundColor: 'transparent',
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(1, 101, 204, 0.7)',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                },
                layoutCenter: ['50%', '50%'],
                layoutSize: 2000
            },
            series: [{
                name: '地点',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke',
                    period: 7,
                    scale: 26
                },
                label: {
                    emphasis: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: 2,
                showEffectOn: 'render',
                itemStyle: {
                    normal: {
                        color: '#46bee9'
                    }
                },
                data: [{
                    name: '昆明',
                    value: [102.712251, 25.040609, 100]
                }, {
                    name: '玉溪',
                    value: [102.543907, 24.350461, 99]
                }, {
                    name: '贵阳',
                    value: [106.713478, 26.578343, 95]
                }, {
                    name: '成都',
                    value: [104.065735, 30.659462, 90]
                }, {
                    name: '广州',
                    value: [113.280637, 23.125178, 80]
                }, {
                    name: '桂林',
                    value: [110.299121, 25.274215, 70]
                }, {
                    name: '武汉',
                    value: [114.298572, 30.584355, 60]
                }]
            }, {
                name: '线路',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                large: true,
                effect: {
                    show: true,
                    constantSpeed: 30,
                    symbol: 'arrow', //ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
                    symbolSize: 6,
                    trailLength: 0
                },
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#58B3CC'
                        }, {
                            offset: 1,
                            color: '#F58158'
                        }], false),
                        width: 3,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: [{
                    fromName: '昆明',
                    toName: '玉溪',
                    coords: [
                        [102.712251, 25.040609, 100],
                        [102.543907, 24.350461, 99]
                    ]
                }, {
                    fromName: '昆明',
                    toName: '贵阳',
                    coords: [
                        [102.712251, 25.040609, 100],
                        [106.713478, 26.578343, 95]
                    ]
                }, {
                    fromName: '昆明',
                    toName: '成都',
                    coords: [
                        [102.712251, 25.040609, 100],
                        [104.065735, 30.659462, 90]
                    ]
                }, {
                    fromName: '昆明',
                    toName: '广州',
                    coords: [
                        [102.712251, 25.040609, 100],
                        [113.280637, 23.125178, 80]
                    ]
                }, {
                    fromName: '昆明',
                    toName: '桂林',
                    coords: [
                        [102.712251, 25.040609, 100],
                        [110.299121, 25.274215, 70]
                    ]
                }, {
                    fromName: '昆明',
                    toName: '武汉',
                    coords: [
                        [102.712251, 25.040609, 100],
                        [114.298572, 30.584355, 60]
                    ]
                }]
            }]
        };

        // actual configurations of all charts on the page
        var the_config = {
            // add shadows to bars
            /*
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
            }),*/
            option_map: mapOptBase
        };

        return the_config;
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
                    data: series_i
                });

            });

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

        } catch (e) {
            console.log('exception occurred!');
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

}(jQuery, window, echarts))