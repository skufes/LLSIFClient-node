const PackageModel = require("./model/package")
const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const path = require("path")
class PackageStore {
    constructor () {
    }

    installPackage(pkg) {
        return PackageModel.findOne({ where: {
            id: pkg.id,
            type: pkg.type
        }})
        .then(pkgFd => {
            return new Promise((resolve, reject) => {
                if (!pkgFd) {
                    PackageModel.create(pkg)
                    .then(pkgCt => resolve(pkgCt))
                }
                else resolve(pkgFd)
            })
        })
    }

    getInstalledPackagesOfType(typeId) {
        return PackageModel.findAll({ where: { type: typeId } })
        .map(pkg => pkg.id)
    }

    getInstalledPackages() {
        return PackageModel.findAll({})
        .map(pkg => { return { package_type: pkg.type, package_id: pkg.id } })
    }
}

module.exports = PackageStore