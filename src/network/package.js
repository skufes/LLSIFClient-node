const crypto = require("crypto")
const Promise = require("bluebird")
const child_process = Promise.promisifyAll(require("child_process"))
const path = require("path")
const fs = Promise.promisifyAll(require("fs"))
const winston = require("../logging")
const jsesc = require("jsesc")

class Package {
    constructor(config, pkg, releaseKeys, idx, len) {
        this.config = config
        this.url = pkg.url
        this.releaseKeys = releaseKeys
        this.id = crypto.createHash("sha1").update(this.url).digest("hex")
        this.indexOfPackage = idx
        this.numberOfPackages = len
    }

    get bin() { return this.config.directory.bin }
    get script() { return this.config.directory.script }
    get tempDir() { return this.config.directory.temp }
    get externalDir() { return this.config.directory.runtime.external }
    get downloadDir() { return path.join(this.tempDir, "download") }
    get downloadPath() { return path.join(this.tempDir, "download", `${this.id}.zip`) }
    get unzipPath() { return path.join(this.tempDir, "download", `${this.id}`) }
    get shortId() { return `${this.id.substr(0, 8)}(${this.indexOfPackage}/${this.numberOfPackages})` }
    get depPath() { return this.config.directory.dep }

    patch() {
        return new Promise((resolve, reject) => {
            this.ariaGet()
            .then(() => this.unzip())
            .then(() => this.decode())
            .then(() => resolve())
            .catch(e => reject(e))
        })
    }
    wgetGet() {
        return child_process.execAsync(`${this.bin['wget']} "${this.url}" -O ${this.downloadPath}`)
        .then((stdout) => {
            return new Promise((resolve, reject) => {
                //if (stdout) console.log(stdout)
                winston.verbose(`Part ${this.shortId} terminated.`)
                resolve()
            })
        })
        //.catch(e, (err) => { console.log(err) })
    }

    ariaGet() {
        return child_process.execAsync(`${this.bin['aria2c']} "${this.url}" -d ${this.downloadDir} -o ${this.id}.zip --allow-overwrite=true`)
        .then((stdout) => {
            return new Promise((resolve, reject) => {
				//console.log(`${this.bin['aria2c']} "${this.url}" -d ${this.downloadDir} -o ${this.id}.zip --allow-overwrite=true`)
                //if (stdout) console.log(stdout)
                winston.verbose(`Part ${this.shortId} download terminated.`)
                resolve()
            })
        })
        //.catch(e, (err) => { console.log(err) })
    }

    unzip() {
        return child_process.execAsync(`${this.bin['7z']} x -o"${this.unzipPath}" "${this.downloadPath}" > NUL:`)
        .then((stdout) => {
            return new Promise((resolve, reject) => {
                //if (stdout) console.log(stdout)
                winston.verbose(`Part ${this.shortId} unzip finished.`)
                resolve()
            })
        })
        .then(() => fs.unlinkAsync(`${this.downloadPath}`))
    }

    decode() {
        const os = require("os")
        //return child_process.execAsync(`${this.script['decode']} "${this.depPath}" "${this.unzipPath}" "${this.externalDir}"`)
        if (os.platform() === "win32")
            return child_process.execAsync(
                `${this.script['decode']} \
                    --dependent-path="${this.depPath}"\
                    --temp-path="${this.unzipPath}"\
                    --external-path="${this.externalDir}"\
                    --db-decrypt-keys="${jsesc(JSON.stringify(this.releaseKeys), { quotes: "double" })}`
                    )
            .then((stdout, stderr) => {
                return new Promise((resolve, reject) => {
                    //console.log(`${this.script['decode']} "${this.depPath}" "${this.unzipPath}" "${this.externalDir}"`)
                    //if (stdout) console.log(stdout)
                    //if (stderr) console.log(stderr)
                    winston.verbose(`Part ${this.shortId} decode finished.`)
                    resolve()
                })
            })
        else
            return child_process.execAsync(
                `${this.script['decode']} \
                    --dependent-path="${this.depPath}"\
                    --temp-path="${this.unzipPath}"\
                    --external-path="${this.externalDir}"\
                    --db-decrypt-keys='${JSON.stringify(this.releaseKeys)}'`
                    )
            .then((stdout, stderr) => {
                return new Promise((resolve, reject) => {
                    //console.log(`${this.script['decode']} "${this.depPath}" "${this.unzipPath}" "${this.externalDir}"`)
                    //if (stdout) console.log(stdout)
                    //if (stderr) console.log(stderr)
                    winston.verbose(`Part ${this.shortId} decode finished.`)
                    resolve()
                })
            })

    }
}

module.exports = Package
