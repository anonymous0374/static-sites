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
                        color: 'rgba(1, 101, 204, 0.7)'
                    }
                },
                layoutCenter: ['50%', '60%'],
                layoutSize: 5000,
                selectedMode: true,
                regions: [{ // an example region item
                    name: '云南',
                    itemStyle: {
                        normal: {
                            areaColor: 'rgba(1, 101, 204, 0.7)',
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#fff',
                            fontSize: 30,
                            // fontWeight: 'bold',
                            formatter: "\n\n\n云南",
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
                    var val = value[2] / 3800;
                    if (val < 5) {
                        return 10
                    } else if (val < 25) {
                        return 15
                    } else if (val < 40) {
                        return 23
                    } else if (val < 60) {
                        return 30
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgba(129, 255, 254, 0.7)'
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
                                formatter: "{b}",
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

        handleCounters();

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
        // setting template of a pie chart
        var pieOptBase = {
            elId: 'vehicle-types',
            type: 'pie',
            color: ['#00ecd5', '#00b0fe', '#3dd1e3', '#ADDD8E', '#467EFF', '#FF7145', '#76FFE7', '#FFD376'],
            series: [{
                name: '解决状态',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                label: {
                    normal: {
                        formatter: "{b}:({d}%)", //"{b}:\n({d}%)"
                        fontSize: 12,
                        color: '#fff'
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
                        shadowColor: 'rgba(0, 1, 0, 0)',
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
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=2"
        };
        var pieOptBase1 = {
            elId: 'vehicle-length',
            type: 'pie',
            color: ['#00ecd5', '#00b0fe', '#3dd1e3', '#ADDD8E', '#467EFF', '#FF7145', '#76FFE7', '#FFD376'],
            series: [{
                name: '解决状态',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                label: {
                    normal: {
                        formatter: "{b}:\n({d}%)", //"{b}:\n({d}%)"
                        fontSize: 12,
                        color: '#fff'
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
                        shadowColor: 'rgba(0, 1, 0, 0)',
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
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=3"
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
                data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            },
            yAxis: {
                type: 'value',
                show: false,
                axisLine: {
                    lineStyle: {
                        color: '#fff;',
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
                left: '-10%',
                right: '0%',
                bottom: '3%',
                containLabel: true
            },
            label: {
                normal: {
                    show: true,
                    formatter: "{c}",

                    color: '#ffffff',
                    fontWeight: 100,
                    color: '#fff'
                }
            },
            series: [],
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=5"
        };

        // actual configurations of all charts on the page
        var the_config = {
            option_vtype_pie: $.extend(true, {}, pieOptBase),
            option_vlength_pie: $.extend(true, {}, pieOptBase1),
            option_vflow_hourly_line: lineOptBase,
            option_vflow_weekly_line: $.extend(true, {}, lineOptBase, {
                series: '',
                elId: 'vehicle-weekly-flow',
                url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=6'
            }),
            option_vflow_monthly_line: $.extend(true, {}, lineOptBase, {
                elId: 'vehicle-monthly-flow',
                url: env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=7',
                xAxis: {
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // month
                }
            }),
        }

        the_config.option_vflow_monthly_line.xAxis.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // monthly
        the_config.option_vflow_weekly_line.xAxis.data = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期七'] // weekday

        return the_config;
    }

    // fetch data for china-map
    function setupMapSeries() {
        var coordsPromise = $.getJSON('javascripts/vendor/indexed-city-coords.json');
        var valuePromise = $.getJSON(env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=4');

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
            var convertData = function(data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var index;
                    coordsBase['index'].map(function(ktem, kndex) {
                        if (ktem.indexOf([data[i].name]) !== -1) {
                            index = kndex;
                        }
                    })

                    var geoCoord = coordsBase['coords'][index];
                    if (geoCoord) {
                        res.push(geoCoord.concat(data[i].value));
                    }
                }

                return res;
            };

            // points only map
            points = values.map(function(item) {
                var name = item.valueText;
                return {
                    name: name,
                    value: Number(item.valueLong.replace(',', '')),
                };
            });
            var resultPoints = [],
                unique = [],
                uniqueStr = [],
                finalResult = [];
            // var middlePoints = points;

            var middlePoints = points.map(function(item, index) {
                return item.name
            })

            middlePoints.forEach(function(item, index) {
                if (uniqueStr.indexOf(item) == -1) {
                    uniqueStr.push(item)
                    unique.push(index);
                }
            })

            unique.forEach(function(item, index) {
                points.forEach(function(ktem, kndex) {
                    if (item === kndex) {
                        finalResult.push(ktem);
                    }
                })
            })
            var valList = convertData(finalResult); // 经纬度 数值集合
            var res = finalResult.map(function(item, index) {
                item.value = valList[index]
                return item
            })
        }
        return {
            points: res
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

            html += '<div style="border-radius: 5px; background-image: url(images/number-bg.png); margin-right: 5px; position: relative;" id="' + elId + '_' + i + '" class="' + elClass + '" data-id="' + i + '">';
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

    /////////// Counter handlers ////////////////
    function handleCounters() {
        var prefix = env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYunNanTruckData?type=';
        var ajaxList = ('1').split(' ').map(function(v) {
            return $.get(prefix + v);
        });

        $.when.apply($, ajaxList)
            .done(function(arrRes0) {
                handleCounters.setCounter(arrRes0, 0);
                generateCounterModules(counters);
            });
    }

    handleCounters.setCounter = function(arr, index) {
        var res = JSON.parse(arr);
        if (res && res.result === 'success' && counters[index]) {
            counters[index].value = parseInt(res.data[0].valueLong.replace(/\,/g, ''));
        }
    };
    /////////// Counter handlers ////////////////


}(jQuery, window, echarts))