const Promise = require("bluebird")
const winston = require("../logging")

class Download {
    constructor (client) {
        this.client = client
    }
    batch(query) {
        return new Promise((resolve, reject) => {
            this.client.packageStore.getInstalledPackagesOfType(query.type)
            .then(pkgs => this.client.send("/download/batch", {
                action: "update",
                os: this.client.clientInfo.os, // can cause problem
                excluded_package_ids: pkgs || [],//[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,1001],
                package_type: query.type, // type
                commandNum: this.client.createCommandNum()
            })).then(resp => {
                resolve(resp)
                if (resp.length === 0) winston.verbose(`[api.download] Nothing of TYPE ${query.type} to be batch downloaded.`)
                else winston.info(`[api.download] ${resp.length} object(s) of TYPE ${query.type} to be batch downloaded.`)
            })
            .catch(e => reject(e))
        })
    }

    update(query) {
        return new Promise((resolve, reject) => {
            this.client.packageStore.getInstalledPackages()
            .then(pkgs => this.client.send("/download/update", {
                module: "download",
                action: "update",
                package_list: pkgs || [],//L3_31,
                os: this.client.clientInfo.os,
                install_version: this.client.serverInfo.server_version,
                external_version: this.client.packageInfo.server_version,
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum()
            })
            ).then(resp => {
                resolve(resp)
                if (resp.length > 0) winston.info(`[api.download] ${resp.length} object(s) to be updated.`)
                else winston.verbose("[api.download] Nothing to be updated.")
            })
            .catch(e => reject(e))
        })
    }

    event(query) {
        return new Promise((resolve, reject) => {
            this.client.packageStore.getInstalledPackagesOfType(5)
            .then(pkgs => this.client.send("/download/event", {
                client_version: this.client.packageInfo.server_version,
                os: this.client.clientInfo.os,
                package_type: 5,
                excluded_package_ids: pkgs || [],
                commandNum: this.client.createCommandNum()
            })
            ).then(resp => {
                resolve(resp)
                if (resp.length > 0) winston.info(`[api.download] ${resp.length} object(s) of EVENT to be updated.`)
                else winston.verbose("[api.download] Nothing of EVENT to be updated.")
            })
            .catch(e => reject(e))
        })
    }

    addtional(query) {
        return new Promise((resolve, reject) => {
            this.client.packageStore.getInstalledPackages()
            .then(pkgs => this.client.send("/download/additional", {
                module: "download",
                action: "additional",
                client_version: "", // ?
                package_id: "",
                package_type: "",
                region: "",
                type: "",
                os: this.client.clientInfo.os,
                timeStamp: this.client.createTimeStamp(),
                commandNum: this.client.createCommandNum()
            })
            ).then(resp => {
                resolve(resp)
                if (resp.length > 0) winston.info(`[api.download] ${resp.length} object(s) to be updated.`)
                else winston.verbose("[api.download] Nothing to be updated.")
            })
            .catch(e => reject(e))
        })
    }
}

module.exports = Download