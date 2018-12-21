const schedule = require("node-schedule")
const winston = require("../logging")
const checkUpdate = require("./check_update_safe")
const Promise = require("bluebird")
const AsyncLock = require("async-lock")

const lock = new AsyncLock({
    Promise: Promise,
    timeout: 10000
})

const checkUpdateJob = schedule.scheduleJob("5 * * * * *", () => {
    lock.acquire("update", (done) => {
        new Promise((resolve, reject) =>
            checkUpdate()
            .then((api) => {
                done()
                winston.verbose("[schedule] Check update job complete.")
            })
            .catch(err => {
                done()
                reject(err)
            })
        )
    })
    .catch(err => {
        try {
            winston.error(err)
        } catch(e) {
            winston.error(err.toString())
        }
    })
})
