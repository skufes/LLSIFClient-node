const _ = require('lodash')
const Promise = require('bluebird')

const ServiceApiFactory = require("../factory/svapi")
const Config = require("../network/config")
const Package = require("../network/package")
const Errors = require("../network/error")
const ReleaseKeyStoreFactory = require("../persist")
const DbRefresher = require("./refresh_db")
const plugins = require("./plugins")
let config = new Config("jp")
let factory = new ServiceApiFactory(config)

let releaseKeyStoreFactory = new ReleaseKeyStoreFactory()

const winston = require("../logging")

async function processPackages(packages, config, api) {
    let packageBundles = _.sortBy(_.toPairs(_.groupBy(
        packages,
        package => parseFloat(package.url.match(/\/android\/(\d+\.\d+)\/update/)[1])
    )), bundle => bundle[0])
    for (let bundle of packageBundles) {
        let version = bundle[0]
        let bundlePackages = bundle[1]
        winston.info(`[update] Start to process ${bundlePackages.length} packages for version ${version}.`)
        await Promise.map(
            bundlePackages,
            (pkg, idx, len) => (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch(),
            { concurrency: 5 })
    }
}

module.exports = function () {
    return factory.createWithUserSafe()
    .then((api) => {
        return api.download.update()
        .then(resp => processPackages(resp, config, api))
        /*
        .map((pkg, idx, len) => {
            console.log(pkg, idx, len)
            //return (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch()
        }, {concurrency: 5})
        */
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 0})
        .map((pkg, idx, len) => {
            return (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 1})
        .map((pkg, idx, len) => {
            return (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 2})
        .map((pkg, idx, len) => {
            return (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 3})
        .map((pkg, idx, len) => {
            return (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 4})
        .map((pkg, idx, len) => {
            return (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.event()
        .map((pkg, idx, len) => {
            return (new Package(config, pkg, api.client.releaseKeys, idx, len)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    /*
    .then((api) => {
        return api.download.batch({type: 4})
        .map((pkg) => {
            return (new Package(config, pkg, api.client.releaseKeys)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    */
    .then((api) => {
        return new Promise((resolve, reject) => {
            return releaseKeyStoreFactory.create()
            .then(store =>
                store.sync(api.client.releaseKeys)
                .then(keys => {
                    //console.log(store)
                    if (store.needExternalUpdate) {
                        const refresher = new DbRefresher(config)
                        winston.info(`[main] New key(s) found, they are currently: ${JSON.stringify(keys)}\.`)
                        return refresher.refresh(keys)
                    }
                    else {
                        return new Promise((resolve, reject) => resolve())
                    }
                })
                .then(() => {
                    store.needExternalUpdate = false
                })
            )
            .then(() => resolve(api))
            .catch(err => reject(err))
        })
    })
    .then((api) => plugins(api))
    .then((api) => {
        if (api.outdated) {
            config = new Config("jp")
            factory = new ServiceApiFactory(config)
            return factory.resetServiceApi(api) // frontend shutdown, update and restart
            .then(api => winston.verbose(`[main] Update successful!`))
        }
        else return new Promise(resolve => resolve(api))
    })
    .catch(Errors.ServerOnMaintenenceError, (e) => { winston.verbose("[main] Server on maintainence.") })
}

//module.exports()
