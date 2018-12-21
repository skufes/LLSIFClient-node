const crypto = require('crypto')

var hmac_keys = {
    "jp": Buffer.from([
        0x57, 0x79, 0x74, 0x56,
        0x69, 0x72, 0x76, 0x79,
        0x69, 0x61,
        0x62,
    ]).toString(),
    "cn_sdo": Buffer.from([
        0x70, 0x77, 0x63, 0x6d,
        0x75, 0x55, 0x41, 0x44,
        0x52, 0x50, 0x36, 0x41,
        0x32, 0x44, 0x63, 0x69,
        0x72, 0x41, 0x6f, 0x34,
        0x4b, 0x2b, 0x5a, 0x4c,
        0x61, 0x46, 0x67, 0x31,
        0x58, 0x45, 0x76, 0x44,
        0x70, 0x47, 0x2b, 0x51,
        0x63, 0x30, 0x2b, 0x42,
        0x6a, 0x55,
        0x38
    ]).toString()
}

class HMacDigester {
    constructor(key) {
        this.key = key
    }
    digest (text, key) {
        //return crypto.createHmac("sha1", key ? key : this.key).update(text).digest("hex")
        //return crypto.createHmac("sha1", key).update(text).digest("hex")
        return crypto.createHmac("sha1", key).update(text).digest("hex")
    }
}

function getDigester(name) {
    let key = hmac_keys[name]
    if (key !== undefined)
        return new HMacDigester(key)
    else
        return null
}

//module.exports = getDigester
module.exports = HMacDigester