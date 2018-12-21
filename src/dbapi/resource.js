const ResourceModel = require("./model/resource")
const Promise = require("bluebird")
const uuid = require("uuid")

class ResourceStore {
    constructor() {}
    exist(uri) {
        return new Promise((resolve, reject) =>
            ResourceModel.find({
                where: { uri: uri }
            })
            .then(resource => resolve(resource === undefined))
            .catch(e => reject(e))
        )
    }

    findOrCreate(uri) {
        return new Promise((resolve, reject) => {
            ResourceModel.findOne({
                where: { uri: uri }
            })
            .then(resource => {
                if (resource) resolve(resource)
                else { resolve(ResourceModel.build({ uri: uri })) }
            })
            .catch(err => reject(err))
        })
    }

    save(res) {
        return new Promise((resolve, reject) => {
            ResourceModel.create({
                uri: res.uri,
                filename: res.filename
            })
            .then(res => resolve(res))
            .catch(e => reject(e))
        })
    }
}

module.exports = ResourceStore