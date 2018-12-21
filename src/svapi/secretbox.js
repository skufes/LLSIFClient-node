const Promise = require("bluebird")
const winston = require("../logging")

class SecretBox {
    constructor(client) {
        this.client = client
    }
    all() {
        this.client.authorized = false
        this.client.loggedIn = false
        return new Promise((resolve, reject) => {
            this.client.send("/secretbox/all", {
                module: 'secretbox',
                action: 'all',
                timeStamp: this.client.createTimeStamp()
            }).then(resp => {
                resolve(resp)
            })
            .catch(e => reject(e))
        })
    }
}

module.exports = SecretBox