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

exports.registerMhsMnpLog = async(type, nim, ip, err) =>{
    try {
        const registerMhsMnp = db.collection('mxm22-registerMhsMnp-loggings')
        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await registerMhsMnp.insertOne(data)
        console.log(`registerMhsMnpLog's data was inserted with the _id: ${result.insertedId}`);
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

exports.registerMalpunMabaLog = async(type, nim, ip, err) => {
    try {
        const registerMalpun1 = db.collection('mxm22-registerMalpunMaba-loggings')

        const data = {
            type,
            nim,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await registerMalpun1.insertOne(data)

        console.log(`registerMalpunMabaLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}

exports.registerMalpunOutsiderLog = async(type, nama, ip, err) => {
    try {
        const registerMalpun2 = db.collection('mxm22-registerMalpunOutsider-loggings')

        const data = {
            type,
            nama,
            ip_address: ip,
            err,
            date_time: helper.createAttendanceTime()
        }

        const result = await registerMalpun2.insertOne(data)

        console.log(`registerMalpunOutsiderLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}

exports.verifyMalpunMabaLog = async(type, namaPanit, divisiPanit, nimTarget, ip , verifValue) => {
    try {
        const verifyMalpunMaba = db.collection('mxm22-verifyMalpunMaba-loggings')

        let value = ''

        if(verifValue == 1){
            value = `VERIFIED`
        }else{
            value = `UNVERIFIED`
        }

        const data = {
            type,
            verified: namaPanit,
            divisiPanit,
            ip,
            nim : nimTarget,
            value,
            date_time: helper.createAttendanceTime()
        }

        const result = await verifyMalpunMaba.insertOne(data)

        console.log(`verifyMalpunMabaLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}

exports.verifyMalpunOutsiderLog = async(type, namaPanit, divisiPanit, namaTarget, ip , verifValue) => {
    try {
        const verifyMalpunOutsider = db.collection('mxm22-verifyMalpunOutsider-loggings')

        let value = ''

        if(verifValue == 1){
            value = `VERIFIED`
        }else{
            value = `UNVERIFIED`
        }

        const data = {
            type,
            verified: namaPanit,
            divisiPanit,
            ip,
            nama : namaTarget,
            value,
            date_time: helper.createAttendanceTime()
        }

        const result = await verifyMalpunOutsider.insertOne(data)

        console.log(`verifyMalpunOutsiderLog's data was inserted with the _id: ${result.insertedId}`)
    } catch (err) {
        console.log(err)
    }
}