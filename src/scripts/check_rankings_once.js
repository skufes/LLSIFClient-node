const schedule = require("node-schedule")
const winston = require("../logging")
const checkRankings = require("./check_rankings")
const Promise = require("bluebird")

checkRankings()
.then((api) => {
    winston.verbose("[schedule] Check ranking job complete.")
})
.catch(err => {
    reject(err)
})
