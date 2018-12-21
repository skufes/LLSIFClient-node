const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "runtime/database/keychain.db",
    logging: false,
    underscore: false
})

const KeyChain = sequelize.define("key_chain", {
    loginKey:       { type: Sequelize.STRING },
    loginPassword:  { type: Sequelize.STRING },
    platform:       { type: Sequelize.STRING }
})

const HandoverPasscode = sequelize.define("handover_passcode", {
    passcode:       { type: Sequelize.STRING },
    expireAt:       { type: Sequelize.STRING }
})

const User = sequelize.define("user", {
    uid:            { type: Sequelize.STRING },
    name:           { type: Sequelize.STRING }
})

HandoverPasscode.belongsTo(KeyChain)
KeyChain.hasOne(HandoverPasscode)

User.belongsTo(KeyChain)
KeyChain.hasOne(User)

if (require.main === module) sequelize.sync()

module.exports = { KeyChain, HandoverPasscode, User }