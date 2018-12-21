const ServiceApiFactory = require("../factory/svapi")
const Config = require("../network/config")

let config = new Config("jp")
let factory = new ServiceApiFactory(config)

module.exports = function() {
    return factory.createWithNewUser()
    .then((api) => {
    })
}