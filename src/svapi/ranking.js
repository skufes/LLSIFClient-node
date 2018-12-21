var Promise = require("bluebird")

class Ranking {
    constructor(client) {
        this.client = client
    }

    eventPlayer(query) {
        return new Promise((resolve, reject) => {
            this.client.send("/ranking/eventPlayer", {
                module: "ranking",
                action: "eventPlayer",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                mgd: 1,
                buff: query.buff,
                page: query.page,
                limit: query.limit,
                event_id: query.eventId,
                rank: query.rank,
                id: query.id
            }).then(resp => {
                resolve(resp)
            })
        })
    }

    eventLive(query) {
        return new Promise((resolve, reject) => {
            this.client.send("/ranking/eventLive", {
                module: "ranking",
                action: "eventLive",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                mgd: 1,
                buff: query.buff,
                page: query.page,
                limit: query.limit,
                event_id: query.eventId,
                rank: query.rank,
                id: query.id
            }).then(resp => {
                resolve(resp)
            })
        })
    }

    eventFriendPlayer(query) {
       return new Promise((resolve, reject) => {
            this.client.send("/ranking/eventFriendPlayer", {
                module: "ranking",
                action: "eventFriendPlayer",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                mgd: 1,
                buff: query.buff,
                page: query.page,
                limit: query.limit,
                event_id: query.eventId,
                rank: query.rank,
                id: query.id
            }).then(resp => {
                resolve(resp)
            })
       })
    }

    eventFriendLive(query) {
       return new Promise((resolve, reject) => {
            this.client.send("/ranking/eventFriendLive", {
                module: "ranking",
                action: "eventFriendPlayer",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                mgd: 1,
                buff: query.buff,
                page: query.page,
                limit: query.limit,
                event_id: query.eventId,
                rank: query.rank,
                id: query.id
            }).then(resp => {
                resolve(resp)
            })
        })
    }

    eventLiveDetail(query) {
       return new Promise((resolve, reject) => {
            this.client.send("/ranking/eventLiveDetail", {
                module: "ranking",
                action: "eventLiveDetail",
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum(),
                mgd: 1,
                event_id: query.eventId,
                id: query.id
            }, resp => {
                resolve(resp)
            })
        })
    }
}

module.exports = Ranking