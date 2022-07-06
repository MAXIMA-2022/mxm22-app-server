const OrgDB = require('../model/organisator.model')
const StateDB = require('../../state/model/state_activities.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    const { 
        nim, 
        name, 
        email, 
        password, 
        stateID 
    } = req.body

    const hashPass = await bcrypt.hashSync(password, 8)
    const cekNIM = await OrgDB.query().where({ nim })
    const cekSTATE = await StateDB.query().where({ stateID })
    const verified2 = 0
    
    try{

        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            return res.status(409).send({ 
                message: 'Akun anda sebelumnya telah terdaftar' 
            })
           
                
        }

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

        return res.status(200).send({ message: 'Akun baru berhasil ditambahkan'  })

    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.login = async(req, res) => {
    const { nim, password } = req.body;
    const checkingNim = await OrgDB.query().where({ nim })

    try{
        if(checkingNim.length === 0){
            return res.status(400).send({ message : 'NIM atau password salah!' })
        }

        const isPassValid = bcrypt.compareSync(password, checkingNim[0].password)

        if(!isPassValid){
            return res.status(400).send({ message: 'NIM atau password salah!' })
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
    const { nim } = req.params

    try{
        const cekNIM = await OrgDB.query().where({ nim })

        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
            return res.status(404).send({ message: 'NIM ' + nim + ' tidak ditemukan!'})
        }
            
        const result = await OrgDB.query().where({ nim })
        return res.status(200).send(result)

    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateData = async(req, res) => {
    const { nim } = req.params
    const { 
        name,
        email, 
        stateID, 
        verified 
    } = req.body

    const authorizedDiv = ['D01', 'D02']
    const division = req.division
    const cekSTATE = await StateDB.query().where({ stateID })

    try {
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

       
        if(cekSTATE.length === 0 || cekSTATE === [] || cekSTATE === null || cekSTATE === undefined){
            return res.status(404).send({ 
                message: 'STATE yang kamu input tidak terdaftar!' 
            })
        }
                
        if(verified < 0 || verified > 1)
            return res.status(403).send({ 
                message: 'Value hanya boleh angka 0 atau 1 saja!' 
            })
        
        await OrgDB.query().update({
            name,
            email,
            stateID,
            verified
        }).where({ nim })

        return res.status(200).send({ message: 'Data berhasil diupdate' })
             
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.deleteData = async(req, res) => {
    const { nim } = req.params
    const authorizedDiv = ['D01', 'D02']
    const division = req.division

    try{
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
