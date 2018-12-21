const persist = require("node-persist")
const _ = require("lodash")
const Promise = require("bluebird")


class ReleaseKeyStore {
    constructor (data) {
        this.data = data
        this.needPersistUpdate = false
        this.needExternalUpdate = false
    }
    get data() { return this._data }
    set data(value) { this._data = value }

    get needPersistUpdate() { return this._needPersistUpdate }
    set needPersistUpdate(value) { this._needPersistUpdate = value }
    get needExternalUpdate() { return this._needExternalUpdate }
    set needExternalUpdate(value) { this._needExternalUpdate = value }

    update() {
        //console.log(this.data)
        return Promise.resolve(persist.setItem("release_keys", this.data))
    }
    sync(newKeys) {
        return new Promise((resolve, reject) => {
            _.each(newKeys, newKey => {
                if (newKey.id === undefined || newKey.key === undefined)
                reject(new Error(`Invalid key: ${newKey}`))
            })
            this.needPersistUpdate = 
            _.map(newKeys, newKey => _.find(this.data, key => key.id === newKey.id && key.key === newKey.key))
            .reduce((result, cur) => result || cur === undefined, false) || this.needPersistUpdate
            this.needExternalUpdate = this.needExternalUpdate || this.needPersistUpdate
            if (this.needPersistUpdate) {
                this.data = _.unionWith(this._data, newKeys, (a, b) => a.id === b.id && a.key === b.key)
                this.update()
                .then(() => {
                    this.needPersistUpdate = false
                    resolve(this.data)
                })
                .catch(err => reject(err))
            }
            else {
                resolve(this.data)
            }
        })
   }
}

class ReleaseKeyStoreFactory {
    create() {
        return new Promise((resolve, reject) =>
            Promise.resolve(persist.init({
                dir: "runtime/persist"
            }))
            .then(() => Promise.resolve(persist.getItem("release_keys")))
            .then(keys => {
                if (keys !== undefined)
                    resolve(new ReleaseKeyStore(keys))
                else {
                    persist.setItem("release_keys", [])
                    .then(() => persist.getItem("release_keys"))
                    .then(keys => {
                        resolve(new ReleaseKeyStore(keys))
                    })
                    .catch(err => reject(err))
                }
            })
            .catch(err => reject(err))
        )
    }
}

// first time : not resolving
// missing value 2, 3, 5

/*
let factory = new ReleaseKeyStoreFactory()
factory.create()
.then(store => {
    store.sync([{"id": 5, "key": "9329041fdaslkvcxz"}])
    .then(data => {
        //console.log(data)
        //console.log(store.needExternalUpdate)
        store.needExternalUpdate = false
    })
    .then(() => {
        return store.sync([{ "id": 4, "key": `${Math.random()}` }])
    })
    .then(data => {
        //console.log(data)
        //console.log(store.needExternalUpdate)
        store.needExternalUpdate = false
    })
})
*/
module.exports = ReleaseKeyStoreFactory