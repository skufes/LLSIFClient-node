const randomString = require("randomstring")
const RequestHeadersFactory = require("./header")

class RequestOptionsFactory {
    constructor (config) {
        this.config = config
        this.headersFactory = new RequestHeadersFactory(this.config)
    }
    newOptions(dataObject, authorizeObject, userId, hmacKey) {
        let options = {
            proxy: this.config.proxy,
            compressed: true,
            multipart: dataObject ? true : false,
            headers: this.headersFactory.newHeader(dataObject, authorizeObject, userId, hmacKey),
            boundary: "----------------------------" + randomString.generate({
                length: 12,
                charset: "hex"
            })
        }
        return options
    }
}

module.exports = RequestOptionsFactory