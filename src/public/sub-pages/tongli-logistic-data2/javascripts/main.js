(function($, host, echarts) {
    if (!echarts) {
        alert('eChart library is not loaded properly, program exit!');
        return;
    }

    // config of all charts on this page
    var config = getConfigTemplate();


    $(function() {
        var charts = []; // eChart instances

        // fetch data and initialize charts after DOM is ready for manipulation
        $(Object.keys(config)).each(function(index, key) {
            (function() {
                var chart = {};
                chart = echarts.init($('#' + config[key].elId)[0]);
                charts.push({
                    'chart': chart,
                    'id': config[key].elId
                });

                // fetch data asynchronously
                // var promise = new Promise();
                chart.setOption(config[key]);
            }());
        });

    });

    /////////////////////  CONFIGURATIONS BELOW //////////////////////////////////////////////

    // specific configurations for each chart
    function getConfigTemplate() {
        // basic settings of bar-charts
        var barOptBase = {
            elId: 'leng-lian-frequent',
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
                data: ['广州', '北京', '南京', '上海', '武汉', '西双版纳', '玉溪', '郑州', '南宁', '杭州'],
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
                barWidth: '60%',
                itemStyle: {
                    barBorderRadius: 40
                },
                data: [10, 50, 100, 150, 200, 250, 300, 350, 400, 450]
            }]

        };

        // another type of bar-chart
        var barOptBase2 = $.extend(true, {}, barOptBase, {
            elId: 'full-top5',
            grid: {
                left: '-15%',
                top: '5%',
                bottom: '-5%',
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
                data: [{
                    value: 'No.5. 玉溪 -- 重庆',
                    textStyle: {
                        fontSize: 10,
                        color: 'white',
                        padding: [-40, -90, 0, 0]
                    }
                }, {
                    value: 'No.4. 玉溪 -- 贵阳',
                    textStyle: {
                        fontSize: 10,
                        color: 'white',
                        padding: [-40, -90, 0, 0]
                    }
                }, {
                    value: 'No.3. 玉溪 -- 昆明',
                    textStyle: {
                        fontSize: 10,
                        color: 'white',
                        padding: [-40, -90, 0, 0]
                    }
                }, {
                    value: 'No.2. 玉溪 -- 成都',
                    textStyle: {
                        fontSize: 10,
                        color: 'white',
                        padding: [-40, -90, 0, 0]
                    }
                }, {
                    value: 'No.1. 玉溪 -- 武汉',
                    textStyle: {
                        fontSize: 10,
                        color: 'white',
                        padding: [-40, -90, 0, 0]
                    }
                }]
            },
            series: {
                type: 'bar',
                barWidth: '40%',
                data: [180, 150, 120, 80, 70]
            }
        });

        // basic settings of line-charts
        var lineOptBase = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
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
                axisTick: {
                    show: false
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
                // name: 'y',
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
                // name: '3的指数',
                type: 'line',
                lineStyle: {
                    // normal:
                },
                data: [10, 90, 70, 80, 90, 100, 20, 50, 40, 30, 60, 30]
            }, {
                // name: '2的指数',
                type: 'line',
                lineStyle: {
                    normal: {
                        color: 'pink'
                    }
                },
                data: [20, 30, 70, 80, 50, 40, 30, 60, 30, 90, 100, 20]
            }, {
                // name: '1/2的指数',
                type: 'line',
                lineStyle: {
                    normal: {
                        color: 'green'
                    }
                },
                data: [80, 90, 170, 180, 150, 140, 130, 160, 130, 190, 200, 120]
            }]
        };

        // basic settings of a pie chart
        var pieOptBase = {
            elId: 'chechang',
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
                            color: '#999',

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
                    name: '2米一下',
                    color: '#00abf3;'
                }, ]
            }]
        };

        // actual configurations of all charts on the page
        var config = {
            option_lenglian_frequent_bar: $.extend(true, {}, barOptBase),
            option_lingdan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'lingdan-frequent'
            }),
            option_juanyan_frequent_bar: $.extend(true, {}, barOptBase, {
                elId: 'juanyan-frequent'
            }),
            option_order_trends_line: $.extend(true, {}, lineOptBase, {
                elId: 'order-trends'
            }),
            option_chechang_pie: pieOptBase,
            option_empty_top5: $.extend(true, {}, barOptBase2, {
                elId: 'empty-top5'
            }),
            option_loaded_top5: $.extend(true, {}, barOptBase2, {
                elId: 'loaded-top5'
            })
        };

        return config;
    }

}(jQuery, window, echarts))