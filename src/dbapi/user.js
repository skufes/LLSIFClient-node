const crypto = require("crypto")
const uuid = require("uuid")

const Model = require("./model")
const KeyChain = Model.KeyChain.KeyChain
const HandoverPasscode = Model.KeyChain.HandoverPasscode
const UserModel = Model.KeyChain.User

class User {
    constructor(options) {
        if (!options.keyChain) throw Error("User should be generated from factory")
        this._keyChain = options.keyChain // Must have
        this._userModel = options.userModel // ?
    }
    get userId() { return this._userModel.uid }
    set userId(uid) { this._userModel.uid = uid }
    get name() { return this._userModel.name }
    set name(name) { this._userModel.name = name }
    get loginKey() { return this._keyChain.loginKey }
    get loginPassword() { return this._keyChain.loginPassword }
    save() {
        return this._keyChain.save()
        .then((_keyChain) => {
            this._userModel.keyChainId = _keyChain.id
            return this._userModel.save()
        })
    }
    destroy() {
        return this._userModel.destroy()
        .then(() => { this._keyChain.destroy() })
    }
}
class UserFactory {
    constructor(config) {
        this.config = config
    }

    get platform() {
        return this.config.platform
    }
    static genSecurePair() {
        let id = uuid.v4()
        let data = `${Math.random()}.${Date.now() / 1000 | 0}.${id}`
        return [id, crypto.createHash("sha512").update(data).digest("hex")]
    }
    createUser() {
        let [loginKey, loginPassword] = this.constructor.genSecurePair()
        let keyChain = KeyChain.build({
            platform: this.platform,
            loginKey,
            loginPassword
        })
        let userModel = UserModel.build({ key_chain: keyChain })
        //userModel.setKeyChain(keyChain)
        return new Promise((resolve, reject) => {
            resolve(new User({ keyChain, userModel }))
        })
    }
    getUser(criteria) {
        return UserModel.findOne({ where: criteria, include: { model: KeyChain, where: { platform: this.platform } } })
        .then((userModel) => {
            //console.log(userModel.key_Chain)
            return new Promise((resolve, reject) => {
                resolve(new User({ userModel, keyChain: userModel.key_chain }))
            })
        })
    }

    getUserSafe(criteria) {
        return UserModel.findOne({ where: criteria, include: { model: KeyChain, where: { platform: this.platform } } })
        .then((userModel) => {
            if (userModel) {
                return new Promise((resolve, reject) => {
                    resolve(new User({ userModel, keyChain: userModel.key_chain }))
                })
            }
            else {
                return this.createUser()
            }
        })
    }

    getUserOfId(uid) { return this.getUser({ uid }) }
    getOneUser() { return this.getUser({}) }
    // handover() {}
}

// handover to the server itself

module.exports = { User, UserFactory }