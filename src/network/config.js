const fs = require("fs")
const path = require("path")
const PackageStore = require("../dbapi/package")

//var configBundles = fs.readdirSync("../../config")
class Config {
    constructor(type) {
        let parseJsonConfig = this.constructor.parseJsonConfig
        this.type = type
        this.directory = parseJsonConfig("directory.json", undefined, "./config/system")
        this.environment = parseJsonConfig("environment.json", undefined, "./config/system")
        this.serverInfo = parseJsonConfig("server_info.json", this.externalConfigPath, this.internalConfigPath)
        this.clientInfo = parseJsonConfig("client_info.json", this.externalConfigPath, this.internalConfigPath)
        this.packageInfo = parseJsonConfig("package_info.json", this.externalConfigPath, this.internalConfigPath)
        this.rankingInfo = parseJsonConfig("ranking_info.json", this.externalConfigPath, this.internalConfigPath)
        this.additionalHeaders = parseJsonConfig("additional_headers.android.json", this.externalConfigPath, this.internalConfigPath)
    }

    get externalConfigPath() { return this.constructor.getExternalDirectoryPath(this.directory.runtime.external) }
    get internalConfigPath() { return this.constructor.getInternalDirectoryPath(this.type) }

    static getExternalDirectoryPath(externalDirectoryPath) {
        return path.join(externalDirectoryPath, "config")
    }

    static getInternalDirectoryPath(type) {
        return path.join("./config/internal", type)
    }

    static parseJsonConfig(filename, externalDirectory, internalDirectory) {
        let externalPath = path.join(externalDirectory || "./runtime/external/config", filename)
        let internalPath = path.join(internalDirectory || "./config/internal", filename)
        let jsonString = ""
        try {
            if (fs.existsSync(externalPath))
                jsonString = fs.readFileSync(externalPath)
            else if (fs.existsSync(internalPath))
                jsonString = fs.readFileSync(internalPath)
            else
                throw new ConfigFileNotFoundError(filename)
        } catch (err) {
            console.log(`Failing to read config file \`${filename}\`.`)
            process.exit(1)
        }
        let jsonObject = {}
        try {
            jsonObject = JSON.parse(jsonString)
        }
        catch (err) {
            console.log(`Failing to parse config file \`${filename}\`.`)
            process.exit(1)
        }
        return jsonObject
    }

    static hasNewPackageInstalled() {

    }

    get platform() { return this.additionalHeaders.OS }
    get proxy() { return this.environment.proxy }
}
module.exports = Config
