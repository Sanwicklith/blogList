const express = require('express')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
const mongoose = require('mongoose')

// middleware
app.use(express.json())













app.listen(config.PORT, ()=>{
  logger.info(`server is running on port ${config.PORT}`)
})


module.exports = app