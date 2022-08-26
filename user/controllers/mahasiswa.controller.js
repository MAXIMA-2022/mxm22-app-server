const MhsDB = require('../model/mahasiswa.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const address = require('address')
const helper = require('../../helpers/helper')
const logging = require('../../loggings/controllers/loggings.controllers')
const tokenDB = require('../model/reset_password.model')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAILER_EMAIL,  
        pass: process.env.MAILER_PASS,
    }
})


exports.register = async(req, res) => {
    const { nim } = req.body
    const ip = address.ip()

    try{
        const { 
            name,  
            password, 
            whatsapp, 
            email,
            angkatan, 
            idInstagram, 
            idLine, 
            tanggalLahir, 
            tempatLahir, 
            jenisKelamin, 
            prodi 
        } = req.body

        const nim2 = nim.replace(/^0+/, '')
        const hashPass = await bcrypt.hashSync(password, 8)
        
        const cekNIM = await MhsDB.query().where({ nim })
        if(cekNIM.length !== 0 && cekNIM !== []){
            return res.status(409).send({ 
                message: 'Halo Maximers, akun anda sebelumnya telah terdaftar'
            })
        }
            
        await MhsDB.query().insert({
            name,
            nim: nim2, 
            password: hashPass,
            whatsapp,
            email,
            angkatan,
            idInstagram,
            idLine,
            tanggalLahir,
            tempatLahir,
            jenisKelamin,
            prodi
        })

        return res.status(200).send({ message: 'Akun baru berhasil ditambahkan' })
    }
    catch(err){
        logging.registerLog('Register/Mahasiswa', nim, ip, err.message)
        return res.status(500).send({ message: 'Halo Maximamers, maaf ada kesalahan dari internal' })
    }
}


exports.login = async(req, res) => {
    const { nim, password } = req.body
    const ip = address.ip()

    try{
        const checkingNim = await MhsDB.query().where({ nim })
        if(checkingNim.length === 0){
            return res.status(404).send({
                message : 'Halo Maximers, NIM anda (' + nim + ') tidak terdaftar! Harap melakukan register dahulu'
            })
        }

        const isPassValid = bcrypt.compareSync(password, checkingNim[0].password)
        if(!isPassValid){
            return res.status(400).send({ 
                message: 'Halo Maximers, NIM atau password salah!' 
            })
        }

        const JWTtoken = jwt.sign({ 
                name: checkingNim[0].name,
                nim: checkingNim[0].nim,
                email: checkingNim[0].email,
                role: 'mahasiswa'
            }, process.env.SECRET_KEY, {
                expiresIn: 86400 //equals to 24H
        })

        //              TESTING ONLY NOT FOR FINISHED PRODUCT
        // const decoded = jwt.decode(JWTtoken, {complete: true})
        // console.log(decoded.payload)
        
        return res.status(200).send({
            message: "Login berhasil",
            token: JWTtoken
        })
    }
    catch(err){
        logging.loginLog('Login/Mahasiswa', nim, ip, err.message)
        return res.status(500).send({ message: 'Halo Maximers, maaf ada kesalahan dari internal' })
    }
}


exports.readAllData = async(req, res) => {
    try {
        const result = await MhsDB.query()
        return res.status(200).send(result)
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readSpecificData = async(req, res) => {
    try{
        const { nim } = req.params

        if(nim === null || nim === ':nim'){
            return res.status(404).send({
                message: 'NIM anda kosong! Harap diisi terlebih dahulu'
            })
        }

        const cekNIM = await MhsDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }
        
        const result = await MhsDB.query().where({ nim })
        return res.status(200).send(result) 
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateData = async(req, res) => {
    try{
        const { nim } = req.params

        if(nim === null || nim === ':nim'){
            return res.status(404).send({
                message: 'NIM anda kosong! Harap diisi terlebih dahulu'
            })
        }

        const { 
            name, 
            whatsapp, 
            email,
            angkatan, 
            idInstagram, 
            idLine, 
            tanggalLahir, 
            tempatLahir, 
            jenisKelamin, 
            prodi 
        } = req.body

        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await MhsDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!' 
            })
        }

        await MhsDB.query().update({
            name,
            whatsapp,
            email,
            angkatan,
            idInstagram,
            idLine,
            tanggalLahir,
            tempatLahir,
            jenisKelamin,
            prodi
        }).where({ nim })

        return res.status(200).send({ message: 'Data berhasil diupdate' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.deleteData = async(req, res) => {
    try{
        const { nim } = req.params

        if(nim === null || nim === ':nim'){
            return res.status(404).send({
                message: 'NIM anda kosong! Harap diisi terlebih dahulu'
            })
        }
        
        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await MhsDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        } 
        
        await MhsDB.query().delete().where({ nim })
        return res.status(200).send({ message: 'Data berhasil dihapus' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

//buat yang pake email service
exports.sendToken = async(req, res) => {
    const { nim } = req.body
    const nim2 = nim.replace(/^0+/, '')
    const ip = address.ip()

    try{
        const cekEmail = await MhsDB.query().where({ nim: nim2 })
        const date_time = helper.createAttendanceTime()

        if(cekEmail.length === 0 || cekEmail === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }
        
        const token = helper.createOTP()
        
        const option = {
            from: "Maxima 2022' <noreply@gmail.com>",
            to: `${cekEmail[0].email}`,
            subject: "Reset Password",
            text: `Hai Maximers,\n\nBerikut adalah token untuk reset password : ${token}. \n\nSilahkan melanjutkan proses reset password anda dengan memasukkan token dengan benar.`
        }
    
        transporter.sendMail(option, (err, info) => {
            if(err) console.error(err)
            console.log(`Email terkirim : ${option.to}`)
        })

        await tokenDB.query()
        .insert({
            nim: nim2,
            token,
            confirm: 0,
            requestDate: date_time
        })

        return res.status(200).send({ 
            message: 'Email Berhasil dikirim'
        })
    }
    catch (err) {
        logging.resetPWLog('Reset Password Mahasiswa', nim2, ip, err.message)
        return res.status(500).send({ message: 'Halo Maximamers, maaf ada kesalahan dari internal' })
    }
}


//buat yang ga pake email service
exports.resetingPass2 = async(req, res) => {
    const { token, nim, password, confirmPassword } = req.body
    const nim2 = nim.replace(/^0+/, '')
    const ip = address.ip()

    try{
        const cekToken = await tokenDB.query().where({ token })
        if(cekToken.length === 0 || cekToken === []){
            return res.status(404).send({ 
                message: 'Token yang dimasukkan salah!'
            })
        }

        const exp = cekToken[0].confirm
        if(exp !== 0){
            return res.status(404).send({ 
                message: 'Token yang dimasukkan sudah pernah digunakan!'
            })
        }

        if(password !== confirmPassword){
            return res.status(409).send({ 
                message: 'Password tidak sama!'
            })
        }

        const hashPass = await bcrypt.hashSync(password, 8)
        await MhsDB.query().update({
            password: hashPass
        }).where({ nim: nim2 })

        await tokenDB.query()
        .update({ 
            nim: nim2,
            confirm: 1 
        }).where({ token })

        return res.status(200).send({ message: 'Password berhasil direset'})
    }
    catch (err) {
        logging.resetPWLog('Reset Password Mahasiswa', nim2, ip, err.message)
        return res.status(500).send({ message: 'Halo Maximamers, maaf ada kesalahan dari internal' })
    }
}


//for updating pass (new pass)
exports.resetingPass = async(req, res) => {
    const { token, password, confirmPassword } = req.body
    const getNim = await tokenDB.query().where({ token })
    const nim = getNim[0].nim
    const ip = address.ip()

    try{
        const cekToken = await tokenDB.query().where({ token })
        if(cekToken.length === 0 || cekToken === []){
            return res.status(404).send({ 
                message: 'Token yang dimasukkan salah!'
            })
        }

        const exp = cekToken[0].confirm
        if(exp !== 0){
            return res.status(404).send({ 
                message: 'Token yang dimasukkan sudah pernah digunakan!'
            })
        }

        if(password !== confirmPassword){
            return res.status(409).send({ 
                message: 'Password tidak sama!'
            })
        }

        const hashPass = await bcrypt.hashSync(password, 8)
        await MhsDB.query().update({
            password: hashPass
        }).where({ nim })

        await tokenDB.query()
        .update({ confirm: 1 }).where({ token })

        return res.status(200).send({ message: 'Password berhasil direset'})
    }
    catch (err) {
        logging.resetPWLog('Reset Password Mahasiswa', nim, ip, err.message)
        return res.status(500).send({ message: 'Halo Maximamers, maaf ada kesalahan dari internal' })
    }
}



