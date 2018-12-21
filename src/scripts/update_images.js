const Promise = require("bluebird")
const child_process = Promise.promisifyAll(require("child_process"))
const jsesc = require("jsesc")

class DbRefresher {
    constructor(config) {
        this.config = config
    }
    get refreshDb() { return this.config.directory.scripts["refreshdb"] }
    refresh(keys) {
        child_process.execAsync(
            `${this.refreshdb} \
                --db-decrypt-keys=${jsesc(JSON.stringify(keys))} \
                --db-directory-path=${jsesc(path.resolve(this.config.directory.external, "db"))}`
        )
    }
}

class ResourceUpdater {
    constructor(config) {
        this.config = config
    }
    get genImagesCmd() { return this.config.directory.scripts["gen_images"] }
    get genImagesCwd() { return this.config.directory.scripts["gen_images_cwd"] }
    genImages() {
        child_process.execAsync(
            `${this.genImagesCmd} \
                --external-dir=${jsesc(path.resolve(this.config.directory.external))}`,
            {
                cwd: `${this.genImagesCwd}`
            }
        )
    }
}