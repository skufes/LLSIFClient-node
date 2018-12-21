const ServiceApiFactory = require("../factory/svapi")
const Config = require("../network/config")
const Package = require("../network/package")
const Errors = require("../network/error")

let config = new Config("jp")
let factory = new ServiceApiFactory(config)

const winston = require("../logging")

module.exports = function () {
    return factory.createWithExistedUser()
    .then((api) => {
        return api.download.update()
        .map((pkg) => {
            return (new Package(config, pkg)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 0})
        .map((pkg) => {
            return (new Package(config, pkg)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 1})
        .map((pkg) => {
            return (new Package(config, pkg)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 2})
        .map((pkg) => {
            return (new Package(config, pkg)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 3})
        .map((pkg) => {
            return (new Package(config, pkg)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        return api.download.batch({type: 4})
        .map((pkg) => {
            return (new Package(config, pkg)).patch()
        }, {concurrency: 5})
        .then(() => new Promise(resolve => resolve(api)))
    })
    .then((api) => {
        if (api.outdated) {
            config = new Config("jp")
            factory = new ServiceApiFactory(config)
            return factory.resetApi(api) // frontend shutdown, update and restart
        }
        else return new Promise(resolve => resolve(api))
    })
    .catch(Errors.ServerOnMaintenenceError, (e) => { winston.info("Server on maintainence.") })
}

module.exports()