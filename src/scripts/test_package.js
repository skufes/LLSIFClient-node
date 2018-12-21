const Config = require("../network/config")
const PackageStoreFactory = require("../factory/package")

let config = new Config("jp")
let factory = new PackageStoreFactory(config)
factory.createPackageStore()
.then(store =>
    store.getInstalledPackagesOfType(4)
    .then(pkg => console.log(pkg))
)