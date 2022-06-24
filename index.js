require('dotenv/config')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

//user
require('./user/routes/mahasiswa.route')(app)
require('./user/routes/organisator.route')(app)
require('./user/routes/panitia.route')(app)

//state
require('./state/routes/state_activities.route')(app)
require('./state/routes/state_registration.route')(app)

const PORT = process.env.PORT || 8080
app.listen(PORT, () =>{
    console.log(`Listening to the server ${PORT}`)
})