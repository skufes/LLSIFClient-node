const schedule = require("node-schedule")
const winston = require("../logging")
const checkNews = require("./check_news")
const Promise = require("bluebird")

const checkUpdateJob = schedule.scheduleJob("*/30 * * * * *", () => {
    checkNews()
    .then((api) => {
        winston.verbose("[schedule] Check news job complete.")
    })
    .catch(err => {
        try {
            winston.error(err)
        } catch(e) {
            winston.error(err.toString())
        }
    })
})