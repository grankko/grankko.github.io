'use strict';

class coinGeckoProxy {
    constructor(responseHandler, url) {
        this.apiRequest = new XMLHttpRequest();
        this.url = url;
        this.responseHandler = responseHandler;

        var me = this;
        this.apiRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var apiResult = JSON.parse(this.response);
                me.responseHandler(apiResult);
            }
        }
    }

    callApi() {
        this.apiRequest.open("GET", this.url, true);
        this.apiRequest.send();
    }
}

export {coinGeckoProxy}