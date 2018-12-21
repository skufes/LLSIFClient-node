const AnnouncementModel = require("./model/announcement")
const Promise = require("bluebird")
const winston = require("../logging")

class AnnouncementStore {
    constructor() {
    }
    findOrCreate(criteria) {
        return AnnouncementModel.findOne({ where: criteria })
        .then(announceFd => new Promise((resolve, reject) => {
            if (announceFd) resolve(announceFd)
            else {
                AnnouncementModel.create(criteria)
                .then(announceCt => resolve(announceCt))
                winston.info(`[dbapi.announcement] New announce "${criteria.title}" (#${criteria.announceId}, @${criteria.startDate}) saved.`)
            }
        }))
    }
}

module.exports = AnnouncementStore