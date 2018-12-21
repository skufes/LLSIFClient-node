const Promise = require("bluebird")
const child_process = Promise.promisifyAll(require("child_process"))
const path = require("path")
const fs = Promise.promisifyAll(require("fs"))
const winston = require("../logging")
const ResourceStore = require("../dbapi/resource")
const crypto = require("crypto")

const resourceStore = new ResourceStore()
const _ = require("lodash")

class Resource {
    constructor(config, uri) {
        this.config = config
        this._uri = uri
        this._res = undefined
    }

    get uri() { return this._res ? this._res.uri : this._uri }
    get res() { return this._res }

    get bin() { return this.config.directory.bin }

    get resourceDir() { return this.config.directory.runtime.resource }
    get filename() { return this._res ? this._res.filename : undefined }
    get fileExt() { return this.originalName.match(/\.([^.]+)$/)[1]}
    get originalName() { return this.uri.match(/\/[^\/]+$/)[0] }

    fetch() {
        return new Promise((resolve, reject) => {
            resourceStore.findOrCreate(this.uri)
            .then(res => {
                this._res = res
                if (res.filename) resolve(this)
                else {
                    res.uri = this.uri
                    res.filename = `${crypto.createHash("md5").update(this.uri).digest("hex")}.${this.fileExt}`
                    this.ariaGet()
                    .then(() => res.save())
                    .then(() => resolve(this))
                }
            })
        })
    }

    ariaGet() {
        return child_process.execAsync(`${this.bin['aria2c']} "http:${this.uri}" -d ${this.resourceDir} -o ${this.filename}.${this.fileExt} --allow-overwrite=true`)
            .then((stdout) => {
                return new Promise((resolve, reject) => {
                    //if (stdout) console.log(stdout)
                    winston.info(`[network.resouce] New resource ${this.originalName}(as ${this.filename.substr(0,8)}...${this.fileExt}) saved.`)
                    resolve()
                })
            })
        //.catch(e, (err) => { console.log(err) })
    }
}

module.exports = Resource