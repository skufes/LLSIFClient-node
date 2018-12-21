const ServiceApiFactory = require("../factory/svapi")
const Config = require("../network/config")
const Package = require("../network/package")
const Errors = require("../network/error")

const Promise = require("bluebird")

let config = new Config("jp")
let factory = new ServiceApiFactory(config)

const winston = require("../logging")
const cheerio = require("cheerio")
const fs = Promise.promisifyAll(require("fs"))
const crypto = require("crypto")

const Resource = require("../network/resource")

const child_process = Promise.promisifyAll(require("child_process"))
const path = require("path")

const AnnouncementStore = require("../dbapi/announcement")
const announcementStore = new AnnouncementStore()

class WebPageOld {
    constructor(config, body) {
        this._config = config
        this._query = cheerio.load(body)
        this._hash = crypto.createHash("sha1").update(body).digest("hex")

    }
    get $() { return this._query }
    get htmlDocument() { return this.$.html() }
    get htmlFileName() { return `${this._hash}.html` }
    get htmlFilePath() { return path.join(this.config.directory.runtime.resource, this.htmlFileName) }
    get config() { return this._config }
    save() {
        return new Promise((resolve, reject) => {
            fs.writeFileAsync(this.htmlFilePath, this.htmlDocument)
            .then(() => resolve(this))
            .catch(e => reject(e))
        })
    }
    exists() { return fs.existsSync(this.htmlFilePath) }
    getResourceTagsAsync() {
        var tags = []
        this.$("img").each((k,v) => tags.push(v))
        return Promise.map(tags, tag => new ResourceTag(tag))
    }
    static manipulateTagsAsync(tags) {
        return Promise.map(tags, tag => {
            tag.fetch()
            //.then(tag => tag.replace())
        })
    }
    manipulate() {
        if (this.exists()) return new Promise()
        else {
            return this.getResourceTagsAsync()
            .then(tags => this.constructor.manipulateTagsAsync(tags))
            .then(() => this.save())
        }
    }
}

class Announcment {
    constructor(entry) {
        this._announcement = undefined
        this._entry = entry
        this._res = undefined
    }
    $(query) { return cheerio(query, this.entry) }
    get entry() { return cheerio(this._entry) }
    get announceId() { return this.entry.attr("data-announce-id") }
    get displayOrder() { return this.entry.attr("data-disp-order") }
    get type() { return this.$(".entry-container > h2").first().attr("class") }
    get title() {
        return this.type === "banner" ?
        this.$(".entry-container > h2.banner > img.banner").first().attr("alt") :
        this.$(".entry-container > h2.text").first().text()
    }
    get bannerUrl() { return this.type === "banner" ? this.$(".entry-container > h2.banner > img.banner").attr("src") : null }
    get bannerLocalUrl() { return this._res ? this._res.filename : null }
    get summary() { return this.$(".summary").first().text() }
    get startDate() { return this.$(".start-date").first().text() }
    save() {
        return new Promise((resolve, reject) => {
            if (this.bannerUrl) this.saveResource().then(res => this.saveAnnouncement()).then(() => resolve(this))
            else this.saveAnnouncement(() => resolve(this))
        })
    }
    saveAnnouncement() {
        return announcementStore.findOrCreate({
            announceId: this.announceId,
            displayOrder: this.displayOrder,
            title: this.title,
            bannerUrl: this.bannerUrl,
            bannerLocalUrl: this.bannerLocalUrl,
            summary: this.summary,
            startDate: this.startDate
        })
    }
    saveResource() {
        return new Promise((resolve, reject) => {
            this._res = new Resource(config, this.bannerUrl)
            this._res.fetch().then(res => resolve(res))
        })
    }
}

class ResourceTag {
    constructor(tag) {
        this._tag = tag
        this._res = undefined
    }
    get tag() { return this._tag }
    get queryTag() { return cheerio(this.tag) }
    fetch() {
        return new Resource(config, this.queryTag.attr("src")).fetch()
        .then(res => new Promise((resolve, reject) => {
            this._res = res
            resolve(this)
        }))
    }
    replace() {
        return new Promise((resolve, reject) => {
            this.queryTag.attr("src", this._res.filename)
            resolve(this)
        })
    }
}


module.exports = function () {
    return factory.createWithUserSafe()
    .then(api => {
        return api.webView.get()
        .then(resp => new Promise((resolve, reject) => {
            let $ = cheerio.load(resp)
            let entries = []
            $("div#main > div#container > ul#list > li.entry").map((k,v) => {
                entries.push(v)
            })
            Promise.map(entries, entry => {
                return new Announcment(entry)
            })
            .map(entry => entry.save())
            .then()
        }))
    })
    .catch(Errors.ServerOnMaintenenceError, (e) => { winston.verbose("[main] Server on maintainence.") })
}

module.exports()