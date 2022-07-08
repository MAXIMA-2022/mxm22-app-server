const MhsDB = require('../model/mahasiswa.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    try{
        const { 
            name, 
            nim, 
            password, 
            whatsapp, 
            email, 
            idInstagram, 
            idLine, 
            tanggalLahir, 
            tempatLahir, 
            jenisKelamin, 
            prodi 
        } = req.body

        const hashPass = await bcrypt.hashSync(password, 8)

        const cekNIM = await MhsDB.query().where({ nim })
        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            return res.status(409).send({ 
                message: 'Akun anda sebelumnya telah terdaftar'
            })
        }
            
        await MhsDB.query().insert({
            name,
            nim, 
            password: hashPass,
            whatsapp,
            email,
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
        return res.status(500).send({ message: err.message })
    }
}


exports.login = async(req, res) => {
    try{
        const { nim, password } = req.body

        const checkingNim = await MhsDB.query().where({ nim })
        if(checkingNim.length === 0){
            return res.status(404).send({
                message : 'NIM ' + nim + ' tidak terdaftar! Harap melakukan register dahulu'
            })
        }

        const isPassValid = bcrypt.compareSync(password, checkingNim[0].password)
        if(!isPassValid){
            return res.status(400).send({ 
                message: 'NIM atau password salah!' 
            })
        }

        const JWTtoken = jwt.sign({nim: checkingNim[0].nim}, process.env.SECRET_KEY, {
            expiresIn: 86400 //equals to 24H
        })

        return res.status(200).send({
            message: "Login berhasil",
            token: JWTtoken
        })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
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

        const cekNIM = await MhsDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
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
        const { 
            name, 
            whatsapp, 
            email, 
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
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!' 
            })
        }

        const nim2 = req.decoded_nim
        if(nim2 != nim) {
            return res.status(403).send({ 
                message: 'Kamu tidak dapat mengupdate data milik akun lain!' 
            })
        }
            
        await MhsDB.query().update({
            name,
            whatsapp,
            email,
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
        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await MhsDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
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
