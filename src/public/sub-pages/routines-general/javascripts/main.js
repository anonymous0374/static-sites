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
    var counters = [{
        elId: 'num',
        elClass: 'num',
        value: 972207
    }, {
        elId: 'num1',
        elClass: 'num1',
        value: 65535
    }, {
        elId: 'num2',
        elClass: 'num2',
        value: 35535
    }];

    $(function() { // configs for 3 counter modules
        generateCounterModules(counters);
        setupMapSeries().then(generateMap);
        generateCharts();
        setInterval(generateCharts, 10000);

        setInterval(function() {
            location.reload(true);
        }, 1000 * 60 * 10);

    });

    function generateCounterModules(configs) {
        $(configs).each(function(index, config) {
            play(config.elId, config.elClass, config.value);
        });
    }

    /////////// Counter handlers ////////////////
    function handleCounters() {
        var prefix = env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=';
        var ajaxList = ('8 1 2').split(' ').map(function(v) {
            return $.get(prefix + v);
        });

        $.when.apply($, ajaxList)
            .done(function(arrRes0, arrRes1, arrRes2) {
                handleCounters.setCounter(arrRes0, 0);
                handleCounters.setCounter(arrRes1, 1);
                handleCounters.setCounter(arrRes2, 2);
                // render
                generateCounterModules(counters);
            });
    }

    handleCounters.setCounter = function(arr, index) {
        var res = JSON.parse(arr[0]);
        if (res && res.result === 'success' && counters[index]) {
            counters[index].value = parseInt(res.data[0].valueLong.replace(/\,/g, ''));
        }
    };
    /////////// Counter handlers ////////////////

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
                    itemStyle: {
                        normal: {
                            // areaColor: 'rgb(0, 215, 226)'
                        }
                    },
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
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#46bee9'
                    }
                },
                data: data.points.map(function(item) {
                    if (item.name === '云南') {
                        item.symbol = 'circle'; // 'image://images/logo.png'
                        item.symbolSize = 10;
                        item.itemStyle = {
                            normal: {
                                color: 'red',
                                fontSize: 20
                            }
                        };

                    } else {
                        item.symbol = 'circle'; // 'image://images/logo.png'
                        item.symbolSize = 5;
                        item.itemStyle = {
                            normal: {
                                color: 'gold'
                            }
                        };
                        item.label = {
                            normal: {
                                show: true,
                                formatter: '{b}',
                                fontSize: 13,
                                color: '#fff',
                                position: 'right'
                            }
                        };
                    }

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
        // basic settings of bar-charts
        var barOptBase = {
            elId: 'in-top5',
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
                bottom: 0,
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
                barMinHeight: 50,
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

        // setting template of a pie chart
        var pieOptBase = {
            elId: 'total-top5',
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
            url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=3"
        };

        // actual configurations of all charts on the page
        var the_config = {
            option_in_top5: $.extend(true, {}, barOptBase, {
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=4"
            }),
            option_out_top5: $.extend(true, {}, barOptBase, {
                elId: 'out-top5',
                url: env.getUrlPrefix() + "/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=5"
            }),
            option_chechang_pie: pieOptBase
        }

        return the_config;
    }

    // fetch data for china-map
    function setupMapSeries() {
        var coordsPromise = $.getJSON('javascripts/vendor/indexed-city-coords.json');
        var valuePromise = $.getJSON(env.getUrlPrefix() + '/bigDataBigScreenWeb/boarddatayunan/getYunNanGoodGoingSummary?type=7');

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
            $(response).each(function(index, item) {
                var actualValue = item.valueLong.endsWith('%') ?
                    Number(item.valueLong.slice(0, item.valueLong.length - 1)) :
                    Number(item.valueLong.replace(',', ''));

                series.push(actualValue);
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
            response = response.slice(0, 5);
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

    // helper function
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


}(jQuery, window, echarts))