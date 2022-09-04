const MalpunDB = require('../models/malpun.model')


exports.getAllData = async(req, res) => {
    try {
        const result = await MalpunDB.query()
        return res.status(200).send(result)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.getSpecificData = async(req, res) => {
    try {
        const { regNo } = req.params
        const cekRegNo = await MalpunDB.query().where({ regNo })

        if(cekRegNo.length === 0 || cekRegNo === []){
            return res.status(200).send({
                 message: 'Register Number ' + regNo + ' tidak ditemukan!' 
            })
        }

        return res.status(200).send(cekRegNo)        
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.regisMalpun = async(req, res) => {
    try {
        console.log("test1")
        const {
            email,
            name,
            phoneNumber
        } = req.body
        
        console.log("test2")
        await MalpunDB.query().insert({
            email, 
            name,
            phoneNumber
        }) 
        console.log("test3")
        return res.status(200).send({ message: 'Registrasi Malam Puncak Berhasil' })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}