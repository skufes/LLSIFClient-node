/*
const child_process = require('child_process')

class GetPackage {
    constructor(partId, url) {
        this.partId = partId
        this.url = url
    }
    wget() {
        //console.log("./dep/wget64.exe '" + url + "' -O ./temp/downloaded/" + cnt + ".zip")
        child_process.exec(".\\dep\\wget64.exe \"" + this.url + "\" -O ./temp/downloaded/" + this.partId + ".zip", undefined, (err, stdout) => {
            if (err) console.log(err)
            if (stdout) console.log(stdout)
            console.log(`Part ${this.partId} terminated.`)
        })
    }

    aria2c() {
        child_process.exec(".\\dep\\aria2c.exe \"" + this.url + "\" -o ./temp/downloaded/" + this.partId + ".zip", undefined, (err, stdout) => {
            if (err) console.log(err)
            if (stdout) console.log(stdout)
            console.log(`Part ${this.partId} terminated.`)
        })
    }
}
*/
const ServiceApiFactory = require("./factory/svapi")
const Config = require("./network/config")

let config = new Config("jp")
let factory = new ServiceApiFactory(config)
factory.createWithExistedUser()
.then((api) => {
    console.log(api)
    return api.download.batch()
})
.then((resp) => {
    console.log(resp)
})