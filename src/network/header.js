const querystring = require('querystring')
const HmacDigester = require("./hmac")
const locale = require("locale")
const _ = require("underscore")
class RequestHeadersFactory {
    constructor (config, hmacKeyFunc) {
        //this.hmacDigester = hmac(config.type)
        this.hmacDigester = new HmacDigester()
        this.serverInfo = config.serverInfo
        this.clientInfo = config.clientInfo
        this.additionalHeaders = config.additionalHeaders
    }
    newHeader (data, authorizeObject, userId, hmacKey) {
        let header = {
            authorize: querystring.stringify(authorizeObject),
            'application-id':   this.serverInfo["application_id"],
            region:             this.serverInfo["region"],
            //os:                 this.clientInfo["os"],
            'client-version':   this.serverInfo["server_version"],//"20.10",//this.serverInfo["server_version"],
            debug:              1,
            'api-model':        "straightforward"
            //'user-agent':       ""

            //'time-zone': "", // not nature
            //'accept-language': "zh-cn", // BAD
            //connection: 'keep-alive', // problems?
        }
        header = _.extend(header, this.additionalHeaders)
        if (data) header["X-Message-Code"] = this.hmacDigester.digest(JSON.stringify(data), hmacKey)
        if (userId) header['User-ID'] = userId
        return header
    }
}

module.exports = RequestHeadersFactory