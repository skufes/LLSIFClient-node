const UserFactory = require("../dbapi/user").UserFactory
const HttpClient = require("../network/client")
const PackageStoreFactory = require("./package")

class HttpClientFactory {
    constructor(config) {
        this.config = config
        this.userFactory = new UserFactory(this.config)
        this.packageStoreFactory = new PackageStoreFactory(this.config)
    }

    createClientWithNewUser() {
        return this.userFactory.createUser()
        .then((user) => new Promise((resolve, reject) => {
            let client = new HttpClient(user)
            resolve(client)
        }))
        .then(client => this.packageStoreFactory.bindStore(client))
    }

    createClientWithExistedUser(criteria) {
        return this.userFactory.getUser(criteria)
        .then((user) => new Promise((resolve, reject) => {
            let client = new HttpClient(user)
            resolve(client)
        }))
        .then(client => this.packageStoreFactory.bindStore(client))
    }

    createWithUserSafe(criteria) {
        return this.userFactory.getUserSafe(criteria)
        .then((user) => {
            return this.createClientWithTheUser(user)
        })
    }

    createClientWithTheUser(user) {
        return new Promise((resolve, reject) => {
            let client = new HttpClient(user)
            resolve(client)
        })
        .then(client => this.packageStoreFactory.bindStore(client))
    }

    reloadClient(client) {
        client.reset()
        return this.packageStoreFactory.bindStore(client)
    }
}

module.exports = HttpClientFactory