const Promise = require("bluebird")

class WebView {
    constructor(client) {
        this.client = client
    }
    get(address) {
        return new Promise((resolve, reject) => {
            this.client.viewWeb(address)
            .then(resp => {
                resolve(resp)
            }).catch(e => reject(e))
        })
   }
}

module.exports = WebView