const Promise = require("bluebird")
const child_process = Promise.promisifyAll(require("child_process"))
const jsesc = require("jsesc")
const path = require("path")
const winston = require("../logging")

class DbRefresher {
    constructor(config) {
        this.config = config
    }
    get refreshDb() {
        return this.config.directory.script["refreshdb"] 
    }
    refresh(keys) {
        const os = require("os")
        if (os.platform() === "win32")
            return new Promise((resolve, reject) => {
                return child_process.execAsync(
                    `${this.refreshDb} \
                        --db-decrypt-keys="${jsesc(JSON.stringify(keys), { 'quotes': "double" })}" \
                        --db-directory-path="${jsesc(path.resolve(this.config.directory.runtime.external, "db"), { 'quotes': "double" })}"`
                )
                .then((stdout, stderr) => {
                    if (stdout) winston.verbose(stdout)
                    winston.info(`Decode finished.`)
                    resolve()
                })
                .catch(err => reject(err))
            })
        else
            return new Promise((resolve, reject) => {
                return child_process.execAsync(
                    `${this.refreshDb} \
                        --db-decrypt-keys='${JSON.stringify(keys)}' \
                        --db-directory-path='${path.resolve(this.config.directory.runtime.external, "db")}'`
                )
                .then((stdout, stderr) => {
                    if (stdout) winston.verbose(stdout)
                    winston.info(`Decode finished.`)
                    resolve()
                })
                .catch(err => reject(err))
            })
    }
}

module.exports = DbRefresher