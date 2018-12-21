const Promise = require("bluebird")

class Api {
    constructor(client) {
        this.client = client
    }
    api(queries) {
        return new Promise((resolve, reject) => {
            this.client.send('/api', queries)
            .then(resp => {
                resolve(resp)
            })
        })
    }
    secretbox() {
        return this.api([
            {
                module: 'user',
                action: 'userInfo',
                timeStamp: this.client.createTimeStamp()
            },
            {
                module: 'secretbox',
                action: 'all',
                timeStamp: this.client.createTimeStamp()
            },
        ])
    }
    /*
    userInfo(query) {
        return new Promise((resolve, reject) => {
            this.client.send("/user/userInfo",
            query // generator
            ).then(resp => {
                resolve(resp)
            })
        })
    }
    reload(client) {
        this.client = client
    }
    */
}

module.exports = Api