(function($, host, echarts) {
    'use strict';
    if (!(echarts && $)) {
        alert('eCharts or jQuery libraries are not loaded properly, program exit!');
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

    $(function() {
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
                        areaColor: 'rgba(1, 101, 204, 0)',
                        borderColor: '#404a59',
                        borderWidth: 1,
                        color: 'rgba(51, 69, 89, .5)',
                        borderColor: 'rgba(100,149,237,1)'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        fontSize: 25,
                        color: '#fff',
                    }
                },
                layoutCenter: ['50%', '60%'],
                layoutSize: 5000,
                selectedMode: true,
                label: {
                    normal: {
                        show: true,
                        color: 'rgba(1, 101, 204, 0.7)',
                        fontSize: 25
                    }
                },
                regions: [{ // an example region item
                    name: '云南',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgba(1, 101, 204, 0.7)',
                        }
                    },
                    label: {
                        normal: { //rgb(224, 18, 34)
                            show: true,
                            color: 'gold',
                            fontSize: 35,
                            formatter: '\n\n\n\n云南'
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
                    period: 6,
                    scale: 3,
                    brushType: 'fill'
                },
                symbol: 'circle',
                symbolSize: function(value) {

                    var val = value[2] / 20;
                    if (val < 25) {
                        return 10;
                    } else if (val < 50) {
                        return 15;
                    } else if (val < 100) {
                        return 23;
                    } else {
                        return 30;
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'gold'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        formatter: "{b}",
                        color: '#fff',
                        fontSize: 12,
                        position: 'right'
                    }
                },
                data: data.points.map(function(item, index) {
                    if (item.name === '昆明' || item.name === '玉溪') {
                        item.label = {
                            normal: {
                                show: true,
                                formatter: "   {b}",
                                color: '#fff',
                                fontSize: 20,
                                position: [0, 20]
                            }
                        }
                    }
                    return item;
                })
            }]
        };
        var chart = echarts.init($('#china_map')[0]);
        chart.setOption(mapOptBase);
    }

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
            elId: 'user-active-hours',
            type: 'bar',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: 0,
                left: '20%',
                right: 0,
                bottom: 0
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
            }],
            url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuNanPartyProfile?type=3'
        };

        // setting template of a pie chart
        var pieOptBase = {
            color: ['#00ecd5', '#ADDD8E', '#00b0fe', '#3dd1e3', '#467EFF', '#FF7145', '#76FFE7', '#FFD376'],
            elId: 'user-industries',
            type: 'pie',
            series: [{
                name: '解决状态',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                label: {
                    normal: {
                        formatter: "{b} : {d}%",
                        fontSize: 12,
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
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        borderWidth: 1,
                        borderColor: 'white'
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function(idx) {
                    return Math.random() * 200;
                }
            }],
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuNanPartyProfile?type=1"
        };

        // setting template of line-charts
        var lineOptBase = {
            elId: 'vehicle-hourly-flow',
            color: ['#72e5f5'],
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
                    show: false,
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
                show: false,
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
                left: '2%',
                right: '2%',
                bottom: '15%',
                top: '15%',
            },
            label: {
                normal: {
                    show: true,
                    formatter: "{c}",
                    fontSize: 10,
                    fontWeight: 50,
                    color: '#fff'
                }
            },
            series: [],
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuXiLoadPortLogisticData?type=4"
        };

        // actual configurations of all charts on the page
        var the_config = {
            option_utype_pie: $.extend(true, {}, pieOptBase),
            option_uage_pie: $.extend(true, {}, pieOptBase, {
                elId: 'user-ages',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYuNanPartyProfile?type=2"
            }),
            option_uactive_hours_bar: barOptBase,
            option_uspending_pie: $.extend(true, {}, pieOptBase, {
                elId: 'user-spending',
                url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuNanPartyProfile?type=6'
            }),
            option_active_cities_top5_bar: $.extend(true, {}, pieOptBase, {
                elId: 'active-cities-top5',
                url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuNanPartyProfile?type=7'
            }),
            option_uregistration_times_line: $.extend(true, {}, lineOptBase, {
                elId: 'user-active-months',
                url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuNanPartyProfile?type=8',
            })
        }

        return the_config;
    }

    // fetch data for china-map
    function setupMapSeries() {
        var coordsPromise = $.getJSON('javascripts/vendor/indexed-city-coords.json');
        var valuePromise = $.getJSON(env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYuNanPartyProfile?type=4');

        return $.when(coordsPromise, valuePromise).then(function(coordsResolved, valuesResolved) {
            return generateMapData(coordsResolved[0], valuesResolved[0].data);
        });
    }

    function generateMapData(coordsBase, values) {
        var points = [],
            lines = [];

        if (!$.isArray(values)) {
            // the map has both points and lines
            values = values[0].concat(values[1]).concat(values[-1]);
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
        } else {
            // points only map
            points = values.map(function(item) {
                var coords = getCoord(item.valueText, coordsBase);
                var value = Number(item.valueLong.replace(',', ''));
                var name = item.valueText;

                return {
                    name: name,
                    value: coords.concat(value)
                };

            });
        }

        return {
            points: points
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
                series.push(Number(item.valueLong.replace(',', '')));
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
            // response = response.slice(0, 5);
            $(response).each(function(index, item) {
                series.push({
                    name: item.valueText,
                    value: Number(item.valueLong.replace(',', ''))
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
                };
                var data = [];

                data = response.map(function(item) {
                    return Number(item.valueLong.replace(',', ''));
                });

                option.series = {
                    type: 'line',
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 0, 0, [{
                                    offset: 0,
                                    color: '#00eed5'
                                }, {
                                    offset: 1,
                                    color: '#0074dd'
                                }]
                            )
                        }
                    },
                    data: data
                };

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