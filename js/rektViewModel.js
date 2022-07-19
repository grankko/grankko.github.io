'use strict';

import { coinGeckoProxy } from './coinGeckoProxy.js';

class rektViewModel {
    constructor() {
        this.geckoProxy = new coinGeckoProxy(this.handleApiResult, 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=sek,usd');
        this.sekFormatter = new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
        });
        this.usdFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });        

        this.updateInterval = 45 * 1000;
        this.safsenSekAmount = 1370;
        this.antonEthAmount = 0.075229;
        this.pizzaBtcAmount = 10000;
        this.isPriceWatchStarted = false;
    }

    handleApiResult = (function(apiResult) {
        var antonsPriceInSek = apiResult.ethereum.sek * this.antonEthAmount;
        var pizzaPriceInSek = apiResult.bitcoin.sek * this.pizzaBtcAmount;
        var isAntonRekt = antonsPriceInSek > this.safsenSekAmount;
        
        var antonsLossOrWin = this.sekFormatter.format(Math.abs(this.safsenSekAmount - antonsPriceInSek));
        var antonRektnessIndex = Math.round((apiResult.ethereum.sek / (this.safsenSekAmount / this.antonEthAmount)) * 100);
        
        var resultElement = document.getElementById('resultInSek');
        resultElement.innerText = antonsLossOrWin;
        resultElement.classList.remove(...resultElement.classList);
        resultElement.classList.add(isAntonRekt ? 'loss' : 'win');

        var ariElement = document.getElementById('ari');
        ariElement.classList.remove(...ariElement.classList);
        ariElement.classList.add(antonRektnessIndex < 100 ? 'loss' : 'win');
        ariElement.innerText = antonRektnessIndex;

        document.getElementById('antonPrice').innerText = this.sekFormatter.format(antonsPriceInSek);
        document.getElementById('resultIsRekt').innerText = isAntonRekt ? 'more' : 'less';
        document.getElementById('pizzaPrice').innerText = this.sekFormatter.format(pizzaPriceInSek);
        document.getElementById('currentEthPriceInSek').innerText = this.sekFormatter.format(apiResult.ethereum.sek);
        document.getElementById('currentEthPriceInUsd').innerText = this.usdFormatter.format(apiResult.ethereum.usd);
        
        

    }).bind(this);

    startPriceWatch() {
        if (!this.isPriceWatchStarted) {
            this.isPriceWatchStarted = true;
            var me = this;

            window.setInterval(function () {
                me.geckoProxy.callApi();
            }, me.updateInterval);
        }

        this.geckoProxy.callApi();
    }
}

export { rektViewModel }