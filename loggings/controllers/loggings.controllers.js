const { connectToDb, getDb } = require('../../config/mongo.config')
const helper = require('../../helpers/helper')

let db

connectToDb((err) =>{
    if(err){
        console.log(err)
    }
    console.log('Connected to db')

    db = getDb()
})

exports.loginLog = async(type,nim, ip, err) =>{
    try {
        const login = db.collection("mxm22-login-loggings")
        const data = {
            type: 'jwt-issue/' + type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await login.insertOne(data)

        if(!result){
            console.log('error')
        }

        console.log(`loginLog's data was inserted with the _id: ${result.insertedId}`);

    } catch (err) {
        console.log(err)
    }
}

exports.registerLog = async(type, nim, ip, err) =>{
    try {
        const register = db.collection('mxm22-register-loggings')
        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await register.insertOne(data)
        console.log(`registerLog's data was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.log(err)
    }
}

exports.registerStateLog = async(type, nim, ip, err) => {
    try {
        const registerState = db.collection('mxm22-registerState-loggings')

        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await registerState.insertOne(data)
        console.log(`registerStateLog's data was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.log(err)
    }
}

exports.cancelStateLog = async(type, nim, ip, err) => {
    try {
        const cancelState = db.collection('mxm22-cancelState-loggings')
        
        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await cancelState.insertOne(data)
        console.log(`cancelStateLog's data was inserted with the _id: ${result.insertedId}`)

    } catch (err) {
        console.log(err)
    }
}

exports.attendStateLog = async(type, nim, ip, err) => {
    try {
        const attendState = db.collection('mxm22-attendState-loggings')

        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await attendState.insertOne(data)
        console.log(`attendStateLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}

exports.verifyAttendanceLog = async(type, nim, ip, err) => {
    try {
        const verifyAttendance = db.collection('mxm22-verifyAttendance-loggings')

        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await verifyAttendance.insertOne(data)
        console.log(`verifyStateLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}

exports.resetPWLog = async(type, nim, ip, err) => {
    try {
        const resetPassword = db.collection('mxm22-resetPassword-loggings')
        
        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await resetPassword.insertOne(data)
        console.log(`resetPWLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}

exports.generateTokenLog = async(type, nim, ip, err) => {
    try {
        const generateToken = db.collection('mxm22-generateToken-loggings')
        
        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await generateToken.insertOne(data)
        console.log(`generateTokenLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}