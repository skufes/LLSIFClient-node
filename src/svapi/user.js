const Promise = require("bluebird")

class User {
    constructor(client) {
        this.client = client
    }
    userInfo() {
        return new Promise((resolve, reject) => {
            this.client.send("/user/userInfo", {
                module: "user",
                action: "userInfo",
                timeStamp: this.client.createTimeStamp(),
                mgd: 1,
                commandNum: this.client.createCommandNum()
            }).then(resp => {
                this.client.user.name = resp.user.name
                this.client.user.save()
                resolve(resp)
            }).catch(e => reject(e))
        })
   }
}

module.exports = User