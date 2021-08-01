'use strict';

import { coinGeckoProxy } from './coinGeckoProxy.js';
import ApexCharts from './apexcharts/apexcharts.esm.js';

class chartViewModel {
    constructor() {

        this.sekPrice = 1370;
        this.antonEthAmount = 0.075229;        
        this.txDate = new Date('13 Apr 2021 18:21:02 UTC');
        
        var chartNumberOfDays = this.getDaysSinceTx() + 2;
        var apiUrl = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=sek&days=${chartNumberOfDays}&interval=daily`;

        this.geckoProxy = new coinGeckoProxy(this.handleApiResult, apiUrl);
    }

    handleApiResult = (function(apiResult) {
        
        var pricePoints = [];

        apiResult.prices.forEach(point => {
            pricePoints.push([point[0], (point[1] * this.antonEthAmount).toFixed(0)]);
        });

        this.drawChart(pricePoints);
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
            name: 'What Anton paid',
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
            yaxis: [{
                y: this.sekPrice,
                borderColor: '#00E396',
                label: {
                  borderColor: '#00E396',
                  position: 'left',
                  textAnchor: 'start',
                  style: {
                    color: '#fff',
                    background: '#00E396',
                    fontSize: '20px',
                  },
                  text: 'What we paid'
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
              text: 'What Anton paid',
              style: {
                  fontSize: '20px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '600',
              }
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