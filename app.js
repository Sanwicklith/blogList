const express = require('express')
const app = express()

// middleware
app.use(express.json())













app.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}`)
})


module.exports = app