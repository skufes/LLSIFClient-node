const schedule = require("node-schedule")
const winston = require("../logging")
const checkUpdate = require("./check_update_safe")
const Promise = require("bluebird")

checkUpdate()
    .then((api) => {
        winston.verbose("[schedule] Check update finished.")
    })
    .catch(err => {
        try {
            winston.error(err)
        } catch (e) {
            winston.error(err.toString())
        }
    })