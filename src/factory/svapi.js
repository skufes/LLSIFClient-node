const ServiceApi = require("../svapi")
const HttpClientFactory = require("./client")

class ServiceApiFactory {
    constructor(config) {
        this.config = config
        this.httpClientFactory = new HttpClientFactory(this.config)
    }

    createWithNewUser() {
        return this.httpClientFactory.createClientWithNewUser()
        .then((client) => new Promise((resolve, reject) => {
            //console.log(client)
            resolve(new ServiceApi(client))
        }))
        .then((serviceApi) => new Promise((resolve, reject) => {
            return serviceApi.login.authkey()
            .then(resp => serviceApi.login.startUp())
            .then(resp => serviceApi.login.startWithoutInvite())
            .then(resp => serviceApi.login.authkey())
            .then(resp => serviceApi.login.login())
            .then(resp => serviceApi.user.userInfo())
            .then(resp => resolve(serviceApi))
            .catch(e => reject(e))
        }))
    }

    createWithExistedUser(criteria) {
        return this.httpClientFactory.createClientWithExistedUser(criteria)
        .then((client) => new Promise((resolve, reject) => {
            resolve(new ServiceApi(client))
        }))
        .then((serviceApi) => new Promise((resolve, reject) => {
            return serviceApi.login.authkey()
            .then(resp => serviceApi.login.login())
            .then(resp => serviceApi.user.userInfo())
            .then(resp => resolve(serviceApi))
            .catch(e => reject(e))
        }))
    }

    createWithUserSafe(criteria) {
        return this.httpClientFactory.createWithUserSafe(criteria)
        .then((client) => new Promise((resolve, reject) => {
            resolve(new ServiceApi(client))
        }))
        .then((serviceApi) => new Promise ((resolve, reject) => {
            if (serviceApi.client.hasId) {
                return serviceApi.login.authkey()
                .then(resp => serviceApi.login.startUp())
                .then(resp => new Promise ((resolve, reject) => {
                    this.httpClientFactory.reloadClient(serviceApi.client)
                    .then(client => resolve(resp))
                }))
                .then(resp => serviceApi.login.authkey())
                .then(resp => serviceApi.login.login())
                .then(resp => serviceApi.user.userInfo())
                /** */
                .then(resp => serviceApi.tos.tosCheck())
                .then(resp => serviceApi.tos.tosAgree())
                //.then(resp => serviceApi.user.changeName())
                .then(resp => serviceApi.tutorial.progress())
                .then(resp => serviceApi.login.unitList())
                .then(resp => serviceApi.login.unitSelect({
                    unitInitialSetId: 12
                }))
                .then(resp => serviceApi.tutorial.skip())
                .then(resp => serviceApi.tutorial.skip())
                .then(resp => serviceApi.tutorial.skip())
                /** */
                .then(resp => resolve(serviceApi))
                .catch(e => reject(e))
            }
            else {
                return serviceApi.login.authkey()
                .then(resp => serviceApi.login.login())
                .then(resp => serviceApi.user.userInfo())
                .then(resp => serviceApi.tos.tosCheck())
                .then(resp => resolve(serviceApi))
                .catch(e => reject(e))
            }
        }))
    }

    resetServiceApi(prevServiceApi) {
        let prevClient = prevServiceApi.client
        let currentUser = prevClient.user
        return this.httpClientFactory.createClientWithTheUser(user)
        .then((client) => new Promise((resolve, reject) => {
            resolve(new ServiceApi(client))
        }))
        .then((serviceApi) => new Promise((resolve, reject) => {
            return serviceApi.login.authkey()
            .then(resp => serviceApi.login.login())
            .then(resp => serviceApi.user.userInfo())
            .then(resp => resolve(serviceApi))
            .catch(e => reject(e))
        }))
    }
}

module.exports = ServiceApiFactory