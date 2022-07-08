const OrgDB = require('../model/organisator.model')
const StateDB = require('../../state/model/state_activities.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    try{
        const { 
            nim, 
            name, 
            email, 
            password, 
            stateID 
        } = req.body

        const hashPass = await bcrypt.hashSync(password, 8)
        const verified2 = 0

        const cekNIM = await OrgDB.query().where({ nim })
        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            return res.status(409).send({ 
                message: 'Akun anda sebelumnya telah terdaftar' 
            })      
        }

        const cekSTATE = await StateDB.query().where({ stateID })
        if(cekSTATE.length === 0 || cekSTATE === [] || cekSTATE === null || cekSTATE === undefined){
            return res.status(404).send({ 
                message: 'STATE yang kamu input tidak terdaftar!' 
            })
        }
           
        await OrgDB.query().insert({
            name,
            nim,
            email,
            password: hashPass,
            stateID,
            verified: verified2
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

        const checkingNim = await OrgDB.query().where({ nim })
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

        const ver = await OrgDB.query().select('verified').where({ nim })
        if(ver[0].verified !== 1){
            return res.status(400).send({
                message: 'Akun anda belum terverifikasi!'
            })
        }

        const JWTtoken = jwt.sign({ nim: checkingNim[0].nim }, process.env.SECRET_KEY, {
            expiresIn: 86400 //equals to 24H
        })

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
        const result = await OrgDB.query()
        return res.status(200).send(result)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readSpecificData = async(req, res) => {
    try{
        const { nim } = req.params

        const cekNIM = await OrgDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }
            
        const result = await OrgDB.query().where({ nim })
        return res.status(200).send(result)
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateData = async(req, res) => {
    try {
        const { nim } = req.params
        const { 
            name,
            email, 
            stateID
        } = req.body

        const authorizedDiv = ['D01', 'D02']
        const division = req.division
        
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await OrgDB.query().where({ nim })
        if (cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined) {
            return res.status(404).send({
                message: 'NIM ' + nim + ' tidak ditemukan!' 
            })
        }
        
        const cekSTATE = await StateDB.query().where({ stateID })
        if(cekSTATE.length === 0 || cekSTATE === [] || cekSTATE === null || cekSTATE === undefined){
            return res.status(404).send({ 
                message: 'STATE yang kamu input tidak terdaftar!' 
            })
        }
        
        await OrgDB.query().update({
            name,
            email,
            stateID
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

        const cekNIM = await OrgDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }

        if(verified < 0 || verified > 1){
            return res.status(406).send({ 
                message: 'Value hanya boleh angka 0 atau 1 saja!' 
            })
        }

        await OrgDB.query().update({
            verified
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
        
        const cekNIM = await OrgDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }
               
        await OrgDB.query().delete().where({ nim })
        return res.status(200).send({ message: 'Data berhasil dihapus' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}
