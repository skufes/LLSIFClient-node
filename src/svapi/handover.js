const Promise = require("bluebird")

class Handover {
    constructor(client) {
        this.client = client
    }
    exec(passcode) {
        return new Promise((resolve, reject) => {
            this.client.send("/handover/exec", {
                module: "handover",
                action: "exec",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                handover: passcode,
                mgd: 1
            }).then(resp => {
                if (resp.status_code === 200) resolve(resp)
                else reject(resp)
            })
        })
    }
    start() {
        return new Promise((resolve, reject) => {
            this.client.send("/handover/start", {
                module: "handover",
                action: "start",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                mgd: 1
            }).then(resp => {
                if (resp.status_code === 200) resolve(resp)
                else reject(resp)
            })
        })
    }
    renew() {
        return new Promise((resolve, reject) => {
            this.client.send("/handover/renew", {
                module: "handover",
                action: "renew",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                mgd: 1
            }).then(resp => {
                if (resp.status_code === 200) resolve(resp)
                else reject(resp)
            })
        })
    }
}

module.exports = Handover