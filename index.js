require('dotenv/config')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

require('./user/routes/mahasiswa.route')(app)
require('./user/routes/organisator.route')(app)
require('./user/routes/panitia.route')(app)

const PORT = process.env.PORT || 8080
app.listen(PORT, () =>{
    console.log(`Listening to the server ${PORT}`)
})