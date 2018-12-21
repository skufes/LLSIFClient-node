const ServiceApiFactory = require("../factory/svapi")
const Config = require("../network/config")
const Package = require("../network/package")
const Errors = require("../network/error")

const fs = require('fs')

let config = new Config("jp")
let factory = new ServiceApiFactory(config)

const winston = require("../logging")

function getToken() {
    return factory.createWithUserSafe()
    .then(api => new Promise((resolve, reject) => {
        fs.writeFileSync("./runtime/token.json", JSON.stringify({
            token: api.client.authorizeToken,
            userId: api.client.userId
        }))
        resolve(api)
    }))
    .then(api => new Promise((resolve, reject) => {
        api.api.secretbox()
        .then(resp => {
            fs.writeFileSync("./runtime/gauge_info.json", JSON.stringify(resp[1].result['member_category_list']))
        })
        resolve(api)
    }))
    .catch(Errors.ServerOnMaintenenceError, (e) => { winston.info("Server on maintainence.") })
}

getToken()