const schedule = require("node-schedule")
const winston = require("../logging")
const checkRankings = require("./check_rankings")
const Promise = require("bluebird")

const checkUpdateJob = schedule.scheduleJob("0 * * * * *", () => {
    new Promise((resolve, reject) =>
        checkRankings()
        .then((api) => {
            winston.verbose("[schedule] Check ranking job complete.")
        })
        .catch(err => {
            reject(err)
        })
    )
    .catch(err => {
        try {
            winston.error(err)
        } catch(e) {
            winston.error(err.toString())
        }
    })
})