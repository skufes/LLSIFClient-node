/*
module.exports = {
    Download:   require("./download"),
    Handover:   require("./handover"),
    Login:      require("./login"),
    Ranking:    require("./ranking")
}
*/

const Download  = require("./download")
const Handover  = require("./handover")
const LBonus    = require("./lbonus")
const Login     = require("./login")
const Ranking   = require("./ranking")
const Tos       = require("./tos") // NOT THROWING ERROR?
const User      = require("./user")
const Tutuorial = require("./tutorial")
const WebView   = require("./webview")
const Api       = require("./api")

class ServiceApi {
    constructor(client) {
        this.client = client
        this.constructor.bindClient(this, client)
       //this.webView    = new WebView(this.client)
    }

    reload(client) {
        this.client = client
        this.constructor.bindClient(this, client)
    }

    static bindClient(self, client) {
        self.download   = new Download  (self.client)
        self.handover   = new Handover  (self.client)
        self.lBonus     = new LBonus    (self.client)
        self.login      = new Login     (self.client)
        self.ranking    = new Ranking   (self.client)
        self.tos        = new Tos       (self.client)
        self.user       = new User      (self.client)
        self.tutorial   = new Tutuorial (self.client)
        self.webView    = new WebView   (self.client)
        self.api        = new Api       (self.client)
    }

    get client() { return this._client }
    set client(client) { this._client = client }
}

module.exports = ServiceApi