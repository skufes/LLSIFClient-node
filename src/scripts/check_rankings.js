const _ = require("lodash")
const Promise = require("bluebird")

const ServiceApiFactory = require("../factory/svapi")
const Config = require("../network/config")
const Errors = require("../network/error")
const ReleaseKeyStoreFactory = require("../persist")
const DbRefresher = require("./refresh_db")
const plugins = require("./plugins")
const RankingRecords = require("../dbapi/ranking")
let config = new Config("jp")
let factory = new ServiceApiFactory(config)

let releaseKeyStoreFactory = new ReleaseKeyStoreFactory()
let rankingRecords = new RankingRecords()

const winston = require("../logging")

const EVENT_ID = 112

class RankingFetcher {
    constructor(api, eventId) {
        this.api = api
        this.eventId = eventId
    }

    getLiveRanking(rank) {
        return new Promise((resolve, reject) => {
            this.api.ranking.eventLive({
                buff: 0,
                eventId: this.eventId,
                rank: rank
            })
            .then(resp => resolve(resp.items.pop().score))
            .catch(err => reject(err))
        })
    }

    getLiveRankingCount() {
        return new Promise((resolve, reject) => {
            this.api.ranking.eventLive({
                buff: 0,
                eventId: this.eventId,
                rank: 0
            })
            .then(resp => resolve(resp.total_cnt))
            .catch(err => reject(err))
        })
    }

    getEventRankingCount() {
        return new Promise((resolve, reject) => {
            this.api.ranking.eventPlayer({
                buff: 0,
                eventId: this.eventId,
                rank: 0
            })
            .then(resp => resolve(resp.total_cnt))
            .catch(err => reject(err))
        })
    }

    getEventRanking(rank) {
        return new Promise((resolve, reject) => {
            this.api.ranking.eventPlayer({
                buff: 0,
                eventId: this.eventId,
                rank: rank
            })
            .then(resp => resolve(resp.items.pop().score))
            .catch(err => reject(err))
        })
    }
}

module.exports = function () {
    return factory.createWithUserSafe()
    .then((api) => new Promise((resolve, reject) => {
        const eventId = EVENT_ID
        const fetcher = new RankingFetcher(api, eventId)
        fetcher.getEventRankingCount()
        .then(count => Promise.map(
            _.filter([
                10000,
                50000,
                120000,
                250000,
                450000,
                700000,
                1000000
            ], rank => rank < count),
            rank => fetcher.getEventRanking(rank)
            .then(score => new Promise((resolve, reject) => {
                rankingRecords.saveEventRanking(eventId, rank, score)
                .then(resolve(score))
                .catch(err => reject(err))
            }))
        ))
        .then(() => resolve(api))
        .catch(err => reject(err))
    }))
    .then((api) => new Promise((resolve, reject) => {
        const eventId = EVENT_ID
        const fetcher = new RankingFetcher(api, eventId)
        fetcher.getLiveRankingCount()
        .then(count => Promise.map(
            _.filter([
                10000,
                30000,
                50000,
                75000,
                120000,
                250000,
                450000,
                700000,
                1000000,
            ], rank => rank < count),
            rank => fetcher.getLiveRanking(rank)
            .then(score => new Promise((resolve, reject) => {
                rankingRecords.saveLiveRanking(eventId, rank, score)
                .then(resolve(score))
                .catch(err => reject(err))
            }))
        ))
        .then(() => resolve(api))
        .catch(err => reject(err))
    }))
    .then((api) => {
        /*
        if (api.outdated) {
            config = new Config("jp")
            factory = new ServiceApiFactory(config)
            return factory.resetServiceApi(api) // frontend shutdown, update and restart
            .then(api => winston.verbose(`[main] Update successful!`))
        }
        else return new Promise(resolve => resolve(api))
        */
    })
    .catch(Errors.ServerOnMaintenenceError, (e) => { winston.verbose("[main] Server on maintainence.") })
}

//module.exports()
