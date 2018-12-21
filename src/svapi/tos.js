const Promise = require("bluebird")

class Tos {
    constructor(client) {
        this.client = client
    }
    tosCheck() {
        return new Promise((resolve, reject) => {
            this.client.send("/tos/tosCheck", {
                module: "tos",
                action: "tosCheck",
                timeStamp: this.client.createTimeStamp(),
                mgd: 1,
                commandNum: this.client.createCommandNum()
            }).then(resp => {
                resolve(resp)
            })
        })
    }

    tosAgree() {
        return new Promise((resolve, reject) => {
            this.client.send("/tos/tosAgree", {
                module: "tos",
                action: "tosAgree",
                timeStamp: this.client.createTimeStamp(),
                mgd: 2,
                tos_id: 3,
                commandNum: this.client.createCommandNum()
            }).then(resp => {
                resolve(resp)
            })
        })
    }

}

module.exports = Tos