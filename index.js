require('dotenv/config')
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(fileUpload())

//user
require('./user/routes/mahasiswa.route')(app)
require('./user/routes/organisator.route')(app)
require('./user/routes/panitia.route')(app)
require('./user/routes/divisi.route')(app)

//state
require('./state/routes/day_management.route')(app)
require('./state/routes/state_activities.route')(app)
require('./state/routes/state_registration.route')(app)

//toggle
require('./toggle/routes/toggle.route')(app)

//home
require('./chapters/routes/chaptersDial.routes')(app)
require('./home/routes/homeInfo.routes')(app)
require('./home/routes/homeMedia.routes')(app)

app.get('/', (req, res) => {
    res.status(200).send('<h1>Welcome to MAXIMA 2022 API</h1>')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () =>{
    console.log(`Listening to the server ${PORT}`)
})