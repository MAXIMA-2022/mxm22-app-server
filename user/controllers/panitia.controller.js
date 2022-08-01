const PanitDB = require('../model/panitia.model')
const DivisiDB = require('../model/divisi.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    try{
        const { 
            name, 
            nim, 
            password, 
            email, 
            divisiID
        } = req.body

        const hashPass = await bcrypt.hashSync(password, 8)
        const verified2 = 0

        const cekNIM = await PanitDB.query().where({ nim })
        if(cekNIM.length !== 0){
            return res.status(400).send({
                message: 'NIM sudah terdaftar!'
            })
        }

        const cekDiv = await DivisiDB.query().where({ divisiID })
        if(cekDiv.length === 0 || cekDiv === []){
            return res.status(409).send({ 
                message: 'Divisi yang kamu input tidak terdaftar!' 
            })       
        }

        if(divisiID === 'D01'){
            return res.status(401).send({ 
                message: 'Anda tidak dapat mendaftar pada divisi tersebut' 
            })
        }

        await PanitDB.query().insert({
            name,
            nim,
            password: hashPass,
            email,
            divisiID, 
            verified: verified2
        })

        return res.status(200).send({ message: 'Akun baru berhasil ditambahkan' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}

exports.login = async(req, res)=>{
    try{
        const { nim, password } = req.body

        const checkingNim = await PanitDB.query().where({ nim })
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

        const ver = await PanitDB.query().select('verified').where({ nim })
        if(ver[0].verified !== 1){
            return res.status(400).send({
                message: 'Akun anda belum terverifikasi!'
            })
        }

        const getDivisiName = await DivisiDB.query().where({ divisiID: checkingNim[0].divisiID })

        const JWTtoken = jwt.sign({ 
                name: checkingNim[0].name,
                nim: checkingNim[0].nim,
                email: checkingNim[0].email,
                role: 'panitia',
                divisiName: getDivisiName[0].name,
                divisiCode: checkingNim[0].divisiID
            }, process.env.SECRET_KEY, {
                expiresIn: 86400 //equals to 24H
        })

        //              TESTING ONLY NOT FOR FINISHED PRODUCT
        // const decoded = jwt.decode(JWTtoken, {complete: true})
        // console.log(decoded.payload)

        return res.status(200).send({
            message: "Berhasil login",
            token: JWTtoken
        })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.readAllData = async(req, res) => {
    try {
        const result = await PanitDB.query()
        return res.status(200).send(result)    
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readSpecificData = async(req, res) => {
    try {
        const { nim } = req.params

        const cekNIM = await PanitDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan'
            }) 
        }
            
        const result = await PanitDB.query().where({ nim })
        return res.status(200).send(result)
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateData = async(req,res)=>{
    try {
        const { nim } = req.params
        const { 
            name, 
            email, 
            divisiID
        } = req.body

        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await PanitDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }

        const cekDiv = await DivisiDB.query().where({ divisiID })
        if(cekDiv.length === 0 || cekDiv === []){
            return res.status(404).send({ 
                message: 'Divisi yang kamu input tidak terdaftar!' 
            })
        }

        await PanitDB.query().update({
            name,
            email,
            divisiID
        }).where({ nim })

        return res.status(200).send({ message: 'Data berhasil diupdate' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.updateVerified = async(req, res) => {
    try{
        const { nim } = req.params
        const { verified } = req.body
        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await PanitDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }

        if(verified < 0 || verified > 1){
            return res.status(406).send({ 
                message: 'Value hanya boleh angka 0 atau 1 saja!' 
            })
        }

        await PanitDB.query().update({
            verified
        }).where({ nim })
        return res.status(200).send({ message: 'Data berhasil diupdate' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.deleteData = async(req, res) => {
    try {
        const { nim } = req.params
        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await PanitDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }
    
        await PanitDB.query().delete().where({ nim })
        return res.status(200).send({ message: 'Data berhasil dihapus' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}
