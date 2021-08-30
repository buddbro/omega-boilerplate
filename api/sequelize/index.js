const { Sequelize } = require("sequelize")
const { applyExtraSetup } = require("./extra-setup")

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT } = process.env
const dbUrl = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
const sequelize = new Sequelize(dbUrl)

const modelDefiners = [
  require("./models/user.model")
]

for (const modelDefiner of modelDefiners) modelDefiner(sequelize)

applyExtraSetup(sequelize)

module.exports = sequelize