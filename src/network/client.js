const Promise = require("bluebird")
const needle = Promise.promisifyAll(require("needle"))
const url = require("url")
const xor = require("bitwise-xor")

const RequestOptionsFactory = require("./options")
const Config = require("./config")

const HttpClientErrors = require("./error")
const ServerOnMaintenenceError = HttpClientErrors.ServerOnMaintenenceError
const WrongRequestParamsError = HttpClientErrors.WrongRequestParamsError

const winston = require("../logging")

const crypto = require("crypto")

class HttpClient {
    constructor(user) {
        /* test */
        this._nonce = 1
        this._config = new Config("jp")
        this._requestOptionsFactory = new RequestOptionsFactory(this.config)
        //this._userId = 0
        this._commandNumCnt = 0
        this._user = user
        this._packageStore = undefined

        this._authorized = false
        this._loggedIn = false
        this._outdated = false

	// ... (erased)
    }

    createAuthorizeObject() {
        if (this.authorizeToken) return {
            consumerKey: this.config.serverInfo["consumer_key"],
            timeStamp: Date.now() / 1000 | 0,
            version: "1.1",
            token: this.authorizeToken,
            nonce: this.nonce
        }
        else return {
            consumerKey: this.config.serverInfo["consumer_key"],
            timeStamp: Date.now() / 1000 | 0,
            version: "1.1",
            nonce: this.nonce,
        }

    }

    get config() {
        return this._config
    }
    get nonce() {
        return this._nonce++
    }
    set nonce(value) {
        this._nonce = value
    }
    get outdated() {
        return this._outdated
    }
    set outdated(outdated) {
        this._outdated = outdated
    }
    get serverInfo() {
        return this.config.serverInfo
    }
    get clientInfo() {
        return this.config.clientInfo
    }
    get packageInfo() {
        return this.config.packageInfo
    }
    set authorizeToken(token) {
        this._authorizeToken = token
    }
    get authorizeToken() {
        if (this._authorizeToken && this.authorized) return this._authorizeToken
    }
    get authorized() {
        return this._authorized
    }
    set authorized(authorized) {
        this._authorized = authorized
    }
    set user(user) {
        this._user = user
    }
    get user() {
        return this._user
    }
    set userId(userId) {
        this.user.userId = userId
    }
    get userId() { // Wait until API is stable
        if (this.user.userId && this.authorized && this.loggedIn) return this.user.userId
    }
    get commandNumCount() {
        return this._commandNumCnt++
    }
    get platform() {
        return this.config.platform
    }
    get requestOptionsFactory() {
        return this._requestOptionsFactory
    }
    get packageStore() {
        return this._packageStore
    }
    set packageStore(store) {
        this._packageStore = store
    }
    get hasId() {
        return this.user.userId === undefined
    }
    get devOn() {
        return false
    }
    set releaseKeys(value) {
        this._releaseKeys = value
    }
    get releaseKeys() {
        return this._releaseKeys
    }
    get deviceAssertions() {
	// ... (erased)
    }
    get clientDummyToken() {
	// ... (erased)
    }
    set serverDummyToken(value) {
	// ... (erased)
    }
    get publicKey() {
	// ... (erased)
    }
    get hmacKey() {
	// ... (erased)
    }
    get authData() {
	// ... (erased)
    }
    get aesKey() {
	// ... (erased)
    }
    createRequestUrl(uri) {
        if (!this.devOn) return url.resolve(this.serverInfo.domain, this.serverInfo.end_point + uri)
        else return url.resolve(this.serverInfo.domain, this.serverInfo.end_point + uri).replace("prod", "dev")
    }
    createNewsUri(uri) {
        if (!this.devOn) return this.serverInfo.login_news_uri
        else return this.serverInfo.login_news_uri.replace("prod", "dev")
    }
    createCommandNum() {
        //console.log(this.userId)
        if (this.userId && this.authorized) {
            return `${this.user.loginKey}.${this.createTimeStamp()}.${this.commandNumCount}`
        } else
            return `${this.createTimeStamp()}`
    }
    createTimeStamp() {
        return Date.now() / 1000 | 0
    }

    encryptAES128(key, data, iv) {
        iv = iv ? iv : crypto.randomBytes(16)
        let cipher = crypto.createCipheriv("aes-128-cbc", key, iv)
        let encrypted = cipher.update(data, "utf8")
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return Buffer.concat([iv, encrypted]).toString("base64")
    }

    decryptAES128(key, data) {
        let dataBuffer = Buffer.from(data, "base64")
        let decipher = crypto.createDecipheriv("aes-128-cbc", key, dataBuffer.slice(0, 16))
        let decrypted = decipher.update(dataBuffer.slice(16), "base64")
        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted
    }

    get encryptedUserKey() {
	// ... (erased)
    }

    get encryptedUserPassword() {
	// ... (erased)
    }

    send(uri, data) {
        return new Promise((resolve, reject) => {
            return needle.postAsync(
                    this.createRequestUrl(uri),
                    data ? {
                        "request_data": JSON.stringify(data)
                    } : undefined,
                    this.requestOptionsFactory.newOptions(data, this.createAuthorizeObject(), this.userId, this.hmacKey))
                .then((resp) => {
                    if (this.clientInfo.version !== resp.headers["server-version"]) this.outdated = true
                    if (resp.headers["maintenance"])
                        reject(new ServerOnMaintenenceError("Server currently on maintenance.", resp))
                    else if (resp.statusCode !== 200) // fall to the next section?
                        reject(new WrongRequestParamsError(`[network.client@${uri}] Request parameter is probably wrong, HTTP status code is ${resp.statusCode}.`, resp))
                    else if (resp.body.status_code !== 200)
                        reject(new WrongRequestParamsError(`[network.client@${uri}] Request parameter is probably wrong, returned JSON status code is ${resp.body.status_code}.`, resp))
                    else {
                        if (resp.body.release_info) this.releaseKeys = resp.body.release_info
                        resolve(resp.body.response_data)
                    }
                })
                .catch((e) => {
                    // anticipated error: request timeout
                    reject(e)
                })
        })
    }

    viewWeb(address) {
        return new Promise((resolve, reject) => {
            return needle.getAsync(
                    address || this.createNewsUri(),
                    this.requestOptionsFactory.newOptions(undefined, this.createAuthorizeObject(), this.userId, this.hmacKey))
                .then((resp) => {
                    if (resp.headers["maintenance"])
                        reject(new ServerOnMaintenenceError("Server currently on maintenance.", resp))
                    else resolve(resp.body)
                })
                .catch((e) => {
                    // anticipated error: request timeout
                    reject(e)
                })
        })
    }

    reset() {
        this._nonce = 1
        this._commandNumCnt = 0
        this._packageStore = undefined

        this._authorized = false
        this._loggedIn = false
        this._outdated = false

	// ... (erased)
    }


}

module.exports = HttpClient


// RequestTimeout
// HttpCode
