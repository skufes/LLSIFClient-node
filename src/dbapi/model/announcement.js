const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "runtime/database/announcement.db",
    logging: false,
    underscore: false
})

const AnnouncmentModel = sequelize.define("announcement", {
    announceId: Sequelize.INTEGER,
    displayOrder: Sequelize.INTEGER,
    title: Sequelize.STRING,
    bannerUrl: Sequelize.STRING,
    bannerLocalUrl: Sequelize.STRING,
    summary: Sequelize.STRING,
    startDate: Sequelize.STRING,
    detail: Sequelize.STRING
})

if (require.main === module) sequelize.sync()

module.exports = AnnouncmentModel