const Promise = require("bluebird")
const winston = require("../logging")

class Login {
    constructor(client) {
        this.client = client
    }
    authkey() {
        this.client.authorized = false
        this.client.loggedIn = false
        return new Promise((resolve, reject) => {
            this.client.send("/login/authkey", {
                "dummy_token": this.client.clientDummyToken,
                "auth_data": this.client.authData
            }).then(resp => {
                this.client.authorizeToken = resp["authorize_token"]
                this.client.serverDummyToken = resp["dummy_token"]
                this.client.authorized = true
                winston.debug(`[svapi.login] Auth key get.`)
                resolve(resp)
            })
            .catch(e => reject(e))
        })
    }

    login() {
        return new Promise((resolve, reject) => {
            this.client.send("/login/login", {
                login_key: this.client.encryptedUserKey,
                login_passwd: this.client.encryptedUserPassword,
                "devtoken":"APA91bGkoZ3WtXQ6dOvYcLZ0Xh1AxhxWqgrKfd0ThBDByBEmDF1XrywG6TrKSj-mFwx053XtW-a0_vyLrSOzC9XsSKwSGtJzRS_QfCIcG8qzoS_JEkwX1ok_Ojj6igguT_mN26DiWMbP"
            }).then(resp => {
                this.client.authorizeToken = resp.authorize_token
                this.client.userId = resp.user_id
                this.client.loggedIn = true
                return this.client.user.save()
                .then(() => {
                    winston.verbose(`[svapi.login] Logged in successfully.`)
                    resolve(resp)
                })
            })
            .catch(e => reject(e))
        })
    }

    startUp() {
        return new Promise((resolve, reject) => {
            this.client.send("/login/startUp", {
                login_key: this.client.encryptedUserKey,
                login_passwd: this.client.encryptedUserPassword,
                //login_key: this.client.user.loginKey,
                //login_passwd: this.client.user.loginPassword,
            }).then(resp => {
                this.client.userId = resp.user_id
                return this.client.user.save()
                .then(() => {
                    winston.info(`[svapi.login] Start up successfully.`)
                    resolve(resp)
                })
            })
            .catch(e => reject(e))
        })
    }

    startWithoutInvite() {
        return new Promise((resolve, reject) => {
            this.client.send("/login/startWithoutInvite", {
                //login_key: this.client.user.loginKey,
                //login_passwd: this.client.user.loginPassword,
                login_key: this.client.encryptedUserKey,
                login_passwd: this.client.encryptedUserPassword,
            }).then(resp => {
                resolve(resp)
            })
        })
        .catch(e => reject(e))
    }

    unitList() {
        return new Promise((resolve, reject) => {
            this.client.send("/login/unitList", {
                action: "unitList",
                commandNum: this.client.createCommandNum(),
                mgd: 2,
                module: "login",
                timeStamp: this.client.createTimeStamp()
            }).then(resp => {
                resolve(resp)
            })
        })
        .catch(e => reject(e))
    }

    unitSelect(query) {
        return new Promise((resolve, reject) => {
            this.client.send("/login/unitSelect", {
                action: "unitSelect",
                commandNum: this.client.createCommandNum(),
                mgd: 2,
                module: "login",
                timeStamp: this.client.createTimeStamp(),
                unit_initial_set_id: query.unitInitialSetId
            }).then(resp => {
                resolve(resp)
            })
        })
        .catch(e => reject(e))
    }

}

module.exports = Login