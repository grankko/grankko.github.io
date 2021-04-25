'use strict';

import { coinGeckoProxy } from './coinGeckoProxy.js';
import ApexCharts from './apexcharts/apexcharts.esm.js';

class chartViewModel {
    constructor() {

        this.sekPriceAtTxTime = 19274;
        this.txDate = new Date('13 Apr 2021 18:21:02 UTC');
        
        var chartNumberOfDays = this.getDaysSinceTx() + 2;
        var apiUrl = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=sek&days=${chartNumberOfDays}&interval=daily`;

        this.geckoProxy = new coinGeckoProxy(this.handleApiResult, apiUrl);
    }

    handleApiResult = (function(apiResult) {
        console.log('..got chart data');

        this.drawChart(apiResult.prices);
    }).bind(this);

    update() {
        this.geckoProxy.callApi();
    }

    getDaysSinceTx() {
        const oneDayInMs = 24 * 60 * 60 * 1000;        
        return Math.round(Math.abs((this.txDate - new Date()) / oneDayInMs));
    }

    drawChart(data) {
        var options = {
            series: [{
            name: 'ETH SEK',
            data: data
          }],
            chart: {
            type: 'area',
            stacked: false,
            toolbar: {
              show: false,
            }
          },
          annotations: {
            points: [{
              x: this.txDate.getTime(),
              y: this.sekPriceAtTxTime,
              marker: {
                size: 8,
                fillColor: '#fff',
                strokeColor: 'red',
                radius: 2,
                cssClass: 'apexcharts-custom-class'
              },
              label: {
                borderColor: '#FF4560',
                offsetY: 0,
                style: {
                  color: '#fff',
                  background: '#FF4560',
                },
          
                text: 'Antons transaction',
              }
            }]
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0,
              stops: [0, 90, 100]
            },
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val.toFixed(0);
              },
            },
            title: {
              text: 'SEK / ETH'
            },
          },
          xaxis: {
            type: 'datetime',
          },
          tooltip: {
            shared: false,
            y: {
              formatter: function (val) {
                return val.toFixed(0)
              }
            }
          }
          };
  
          var chart = new ApexCharts(document.querySelector('#ethPriceChart'), options);
          chart.render();
    }
}

export { chartViewModel }