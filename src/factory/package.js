const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const path = require("path")
const PackageStore = require("../dbapi/package")

class PackageStoreFactory {
    constructor(config) {
        this.config = config
    }
    createPackageStore() {
        let store = new PackageStore()
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.config.externalConfigPath)) {

                fs.readdirAsync(this.config.externalConfigPath)

                .map(filename => { return { name: filename, parsed: path.parse(filename) } })

                .filter(pathStruct => pathStruct.parsed.name.match(/^pkg_\d{3,4}_\d{3,4}_info$/))

                .map(pathStruct => new Promise((resolve, reject) => {
                    let matchResult = pathStruct.parsed.name.match(/^pkg_(\d{3,4})_(\d{3,4})_info$/)
                    return store.installPackage({
                        type: parseInt(matchResult[1]),
                        id: parseInt(matchResult[2])
                    })
                    .then(resolve(pathStruct.name))
                }), {
                    concurrency: 5
                })
                /*

                .map(filename => fs.unlink(path.join(this.config.externalConfigPath, filename)), {
                    concurrency: 5
                })
                */

                .then(resolve(store))
            }
            else {
                resolve(store)
            }
        })
    }
    bindStore(client) {
        return this.createPackageStore()
        .then(store => new Promise((resolve, reject) => {
            client.packageStore = store
            resolve(client)
        }))
    }
}

module.exports = PackageStoreFactory