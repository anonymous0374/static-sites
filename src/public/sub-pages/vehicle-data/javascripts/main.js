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

    $(function() { // configs for 3 counter modules
        generateCounterModules(counters);
        generateCharts();
        setInterval(generateCharts, 10000);
        setInterval(function() { // refresh the whole page
            location.reload(true);
        }, 1000 * 60 * 10);

    });

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
            color: ['#58C1DA', '#0BA1FC', '#41D5F2', '#ADDD8E', '#467EFF', '#FF7145', '#76FFE7', '#FFD376'],
            series: [{
                name: '解决状态',
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
            url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=3"
        };

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

        // actual configurations of all charts on the page
        var the_config = {
            option_average_matching_time_bar: $.extend(true, {}, barOptBase, {
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=4"
            }),
            option_matching_time_bar: $.extend(true, {}, barOptBase, {
                elId: 'matching-time',
                url: "http://statictest.tf56.com/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=5"
            }),
            option_chechang_pie: pieOptBase
        }

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

            html += '<div id="' + elId + '_' + i + '" class="' + elClass + '" data-id="' + i + '">';
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


}(jQuery, window, echarts))