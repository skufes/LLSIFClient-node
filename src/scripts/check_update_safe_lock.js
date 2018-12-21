const ServiceApiFactory = require("../factory/svapi")
const Config = require("../network/config")
const Package = require("../network/package")
const Errors = require("../network/error")
const ReleaseKeyStoreFactory = require("../persist")
const DbRefresher = require("./refresh_db")
const plugins = require("./plugins")

const AsyncLock = require("async-lock")

let config = new Config("jp")
let factory = new ServiceApiFactory(config)

let releaseKeyStoreFactory = new ReleaseKeyStoreFactory()

const winston = require("../logging")

function checkUpdate() {
    return factory.createWithUserSafe()
    .then((api) => {
        return api.download.update()
        .map((pkg) => {
            return (new Package(config, pkg, api.client.releaseKeys)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 0})
        .map((pkg) => {
            return (new Package(config, pkg, api.client.releaseKeys)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 1})
        .map((pkg) => {
            return (new Package(config, pkg, api.client.releaseKeys)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 2})
        .map((pkg) => {
            return (new Package(config, pkg, api.client.releaseKeys)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 3})
        .map((pkg) => {
            return (new Package(config, pkg, api.client.releaseKeys)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 4})
        .map((pkg) => {
            return (new Package(config, pkg, api.client.releaseKeys)).patch()
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
                    if (true || store.needExternalUpdate) {
                        const refresher = new DbRefresher(config)
                        winston.info(`[main] New key(s) found, they are currently: ${keys}\.`)
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