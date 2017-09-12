(function($, host, echarts) {
    if (!echarts) {
        alert('eChart library is not loaded properly, program exit!');
        return;
    }

    // get basic configs of all charts on this page
    var config = getConfigTemplate();

    $(function() { // refresh the charts        
        generateCharts();
        setInterval(generateCharts, 3000);

    });

    // fetch data and initialize charts after DOM is ready for manipulation
    function generateCharts() {
        var charts = []; // eChart instances

        $(Object.keys(config)).each(function(index, key) {
            (function() {
                var chart = {};
                var promise = $.ajax({
                    url: config[key].url,
                });

                chart = echarts.init($('#' + config[key].elId)[0]);
                chart.clear();
                charts.push({
                    'chart': chart,
                    'type': config[key].type,
                    'id': config[key].elId
                });

                promise.then(function(rsp) {
                    return dataResolved(rsp, config[key].type);
                }).then(function(data) {
                    var option = config[key];

                    // ALERT!!!! Code to format two special bar charts
                    if (["empty-top5", "loaded-top5"].indexOf(option.elId) !== -1) {
                        var updatedData =
                            data.yAxis.data.map(function(item) {
                                return {
                                    value: item,
                                    textStyle: {
                                        fontSize: 10,
                                        color: 'white',
                                        padding: [-40, -70, 0, 0]
                                    }
                                };
                            });
                        data.series.data = data.series.data.length > 5 ? data.series.data.slice(0, 5) : data.series.data;
                        data.yAxis.data = updatedData.length >= 5 ? updatedData.slice(0, 5) : updatedData;
                    }
                    // END ALERT!!!! Code to format two special bar charts

                    chart.setOption(option, false, true);
                    chart.setOption(data, false, true);
                });

            }());
        })
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
                barWidth: '60%',
                itemStyle: {
                    barBorderRadius: 40
                },
                data: []
            }]

        };

        // another type of bar-chart
        var barOptBase2 = $.extend(true, {}, barOptBase, {
            elId: 'full-top5',
            grid: {
                left: '-10%',
                top: '10%',
                //bottom: '-5%',
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
                        padding: [0, 0, 0, 0]
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
                data: [10, 90, 70, 80, 90, 100, 20, 50, 40, 30, 60, 30]
            }, {
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
            }],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=4"
        };

        // basic settings of a pie chart
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
                    name: '2米以下',
                    color: '#00abf3;'
                }, ]
            }],
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=5"
        };

        // actual configurations of all charts on the page
        var config = {
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
            option_loaded_top5: $.extend(true, {}, barOptBase2, {
                elId: 'loaded-top5',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=7"
            })
        };

        return config;
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
                series.push(item.valueLong);
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

        }


        return option;
    };

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

        }


        return option;
    }

    function pieDataFailed(e) {

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
                    if (item) {

                    }
                });
                $(series_i).each(function(index, item) {
                    if (index + 1 !== parseInt(item.valueText)) {
                        series_i.splice(index, 0, null);
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

                for (i = 0; i < objs.length; i++) {
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

        option = {
            series: series
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