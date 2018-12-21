const RankingModels = require("./model/ranking")
const LiveRankingRecordModel = RankingModels.LiveRankingRecordModel
const EventRankingRecordModel = RankingModels.EventRankingRecordModel
const Promise = require("bluebird")

class RankingRecords {
    constructor() {}
    saveRanking(Model, eventId, rank, score) {
        return new Promise((resolve, reject) => {
            Model.findOne({
                where: {
                    eventId: eventId,
                    rank: rank,
                    score: score
                }
            })
            .then(result => {
                if (result === null) {
                    return Model.create({
                        eventId: eventId,
                        rank: rank,
                        score: score,
                        time: Date.now() / 1000 | 0
                    })
                }
                else return new Promise()
            })
            .catch(err => reject(err))
        })
    }

    saveEventRanking(eventId, rank, score) {
        return this.saveRanking(EventRankingRecordModel, eventId, rank, score)
    }

    saveLiveRanking(eventId, rank, score) {
        return this.saveRanking(LiveRankingRecordModel, eventId, rank, score)
    }
}

module.exports = RankingRecords