'use strict';

import { coinGeckoProxy } from './coinGeckoProxy.js';

class rektViewModel {
    constructor() {
        this.geckoProxy = new coinGeckoProxy(this.handleApiResult, "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=sek");
        this.formatter = new Intl.NumberFormat("sv-SE", {
            style: "currency",
            currency: "SEK",
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
        
        var antonsLossOrWin = this.formatter.format(Math.abs(this.safsenSekAmount - antonsPriceInSek));

        document.getElementById("antonPrice").innerText = this.formatter.format(antonsPriceInSek);
        var resultElement = document.getElementById("resultInSek");
        resultElement.innerText = antonsLossOrWin;
        resultElement.classList.remove(...resultElement.classList);
        resultElement.classList.add(isAntonRekt ? "loss" : "win");

        document.getElementById("resultIsRekt").innerText = isAntonRekt ? "more" : "less";

        document.getElementById("pizzaPrice").innerText = this.formatter.format(pizzaPriceInSek);

        document.getElementById("currentEthPriceInSek").innerText = this.formatter.format(apiResult.ethereum.sek);

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