const PanitDB = require('../model/panitia.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    const { 
        name, 
        nim, 
        password, 
        email, 
        divisiID
    } = req.body

    const hashPass = await bcrypt.hashSync(password, 8)
    const cekNIM = await PanitDB.query().where({ nim })
    const verified2 = 0

    try{
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
            if (divisiID === 'D01')
                return res.status(401).send({ message: 'Anda tidak dapat mendaftar pada divisi tersebut' })
            
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
        else
            return res.status(409).send({ message: 'Akun anda sebelumnya telah terdaftar' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.login = async(req, res)=>{
    const { nim, password } = req.body;
    const checkingNim = await PanitDB.query().where({ nim })

    try{
        if(checkingNim.length === 0){
            return res.status(400).send({
                message : 'NIM atau password salah!'
            })
        }

        const isPassValid = bcrypt.compareSync(password, checkingNim[0].password)

        if(!isPassValid){
            return res.status(400).send({
                message: 'NIM atau password salah!'
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
        const result = await PanitDB.query()
        return res.status(200).send(result)    
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readSpecificData = async(req, res) => {
    const { nim } = req.params

    try {
        const cekNIM = await PanitDB.query().where({ nim })

        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            const result = await PanitDB.query().where({ nim })
            
            return res.status(200).send(result)
        }
        else
            return res.status(404).send({ message: 'NIM ' + nim + ' tidak ditemukan'}) 
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}


exports.updateData = async(req,res)=>{
    const { nim } = req.params
    const { 
        name, 
        email, 
        divisiID, 
        verified 
    } = req.body

    const authorizedDiv = ['D01', 'D02']
    const division = req.division
   
    try {
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await PanitDB.query().where({ nim })
        
        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            await PanitDB.query().update({
                name,
                email,
                divisiID,
                verified
            }).where({ nim })

            return res.status(200).send({ message: 'Data berhasil diupdate' })
        }
        else
            return res.status(404).send({ message: 'NIM ' + nim + ' tidak ditemukan!' })
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}


exports.deleteData = async(req, res) => {
    const { nim } = req.params
    const authorizedDiv = ['D01', 'D02']
    const division = req.division

    try {
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await PanitDB.query().where({ nim })

        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            await PanitDB.query().delete().where({ nim })
            
            return res.status(200).send({ message: 'Data berhasil dihapus' })
        }
        else
            return res.status(404).send({ message: 'NIM ' + nim + ' tidak ditemukan!'})
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}
