const Promise = require("bluebird")

class LBonus {
    constructor(client) {
        this.client = client
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.client.send("/lbonus/execute", {
                module: "lbonus",
                action: "execute",
                timeStamp: this.client.createTimeStamp(),
                mgd: 1,
                commandNum: this.client.createCommandNum()
            }).then(resp => {
                resolve(resp)
            })
        })
   }
}

module.exports = LBonus