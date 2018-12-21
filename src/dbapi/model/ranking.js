const Sequelize = require("sequelize")

/*
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "runtime/database/ranking.db",
    logging: false,
    underscore: false
})
*/

const sequelize = new Sequelize(
    "mysql://skufes_ranking:----------------@localhost/skufes_jp_ranking",
    {
        dialect: "mysql",
        logging: false,
        underscore: false
    }
)

sequelize.authenticate()

const LiveRankingRecordModel = sequelize.define("live_record", {
    eventId: Sequelize.INTEGER,
    rank: Sequelize.INTEGER,
    score: Sequelize.INTEGER,
    time: Sequelize.INTEGER
})

const EventRankingRecordModel = sequelize.define("event_record", {
    eventId: Sequelize.INTEGER,
    rank: Sequelize.INTEGER,
    score: Sequelize.INTEGER,
    time: Sequelize.INTEGER
})


if (require.main === module) sequelize.sync()

module.exports = {
    LiveRankingRecordModel,
    EventRankingRecordModel
}
