const app = require("./express/app")
const sequelize = require("./sequelize")
const port = process.env.PORT

async function assertDatabaseConnectionOk() {
  console.log("Checking database connection...")

  try {
    await sequelize.authenticate()
    console.log("Database connection OK!")
  } catch (error) {
    console.log("Unable to connect to the database: ", error.message)
    process.exit(1)
  }
}

async function init() {
  await assertDatabaseConnectionOk()

  app.listen(port, () => {
    console.log(`Express server started on ${port}. Try some routes!`)
  })
}

init()
