const Promise = require("bluebird")

class RandomLocation {
    static get points () {
        return [
            { latitude: 35.72945654812433, longtitude: 139.71776962280273 },
            { latitude: 35.73030136428586, longtitude: 139.7184455394745 },
            { latitude: 35.72831995141921, longtitude: 139.71979200839996 }
        ]
    }
    static get randomVector(id) {
        if (id !== 1 && id !== 2) return null
        let ratio = Math.random()
        return {
            longtitude: this.constructor.points[id].longtitude * ratio + this.constructor.points[0].longtitude * (1 - ratio),
            latitude: this.constructor.points[id].latitude * ratio + this.constructor.points[0].latitude * (1 - ratio)
        }
    }
    constructor {
        _.values
    }
}

class Area {
    constructor(client) {
        this.client = client
    }
    addReward() {
        return new Promise((resolve, reject) => {
            this.client.send("/area/addReward", {
                module: "area",
                action: "addReward",
                timeStamp: this.client.createTimeStamp(),
                mgd: 1,
                commandNum: this.client.createCommandNum(),
                latitude: 35.72874236664783 + Math.random() * .00001,
                longtitude: 139.71951842308044 +  + Math.random() * .00001,
            }).then(resp => {
                resolve(resp)
            })
        })
    }

}

module.exports = Area