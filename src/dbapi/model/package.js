const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "runtime/database/package.db",
    logging: false,
    underscore: false
})

const PackageModel = sequelize.define("package", {
    _id: { type: Sequelize.INTEGER, primaryKey: true },
    id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
})

if (require.main === module) sequelize.sync()

module.exports = PackageModel