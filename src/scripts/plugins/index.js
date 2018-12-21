const Promise = require("bluebird")
const _ = require("lodash")

const events = [
    //"refresh_db",
    //"./gen_card",
    //"./gen_icon",
    //"./gen_pair"
]

module.exports = function (api) {
    return new Promise((resolve, reject) => {
        return resolve(api)
        _.map(events, file => require(file))
        .reduce(events, (prev, event) => prev.then((res) => event(api, res)), new Promise())
        .then(() => resolve(api))
        .catch(err => reject(err))
    })
}