const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "runtime/database/resource.db",
    logging: false,
    underscore: false
})

const ResouceModel = sequelize.define("resource", {
    uri: Sequelize.STRING,
    filename: Sequelize.STRING
})

if (require.main === module) sequelize.sync()

module.exports = ResouceModel