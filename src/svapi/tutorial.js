const Promise = require("bluebird")

class Tutorial {
    constructor(client) {
        this.client = client
    }
    progress() {
        return new Promise((resolve, reject) => {
            this.client.send("/tutorial/progress", {
                module: "tutorial",
                action: "progress",
                timeStamp: this.client.createTimeStamp(),
                mgd: 2,
                commandNum: this.client.createCommandNum(),
                tutorial_state: 1
            }).then(resp => {
                resolve(resp)
            })
        })
    }

    skip() {
        return new Promise((resolve, reject) => {
            this.client.send("/tutorial/skip", {
                module: "tutorial",
                action: "skip",
                timeStamp: this.client.createTimeStamp(),
                mgd: 2,
                commandNum: this.client.createCommandNum()
            }).then(resp => {
                resolve(resp)
            })
        })
    }

}

module.exports = Tutorial