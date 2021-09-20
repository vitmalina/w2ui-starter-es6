const { exec } = require("child_process");
const express = require('express')
const app = express()
const port = 3100

// log all incomming
app.use((req, res, next) => {
    console.log('Request: ' + req.url)
    next()
})

// static files
app.use(express.static('src'))

// static API
app.use('/api', express.static('api'))

// start sever
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
  exec(`open http://localhost:${port}`)
})