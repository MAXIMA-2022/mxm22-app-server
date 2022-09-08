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
        const { id } = req.params
        const cekRegNo = await MalpunDB.query().where({ id })

        if(cekRegNo.length === 0 || cekRegNo === []){
            return res.status(200).send({
                 message: 'Data dengan ID ' + id + ' tidak ditemukan!' 
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
        const {
            nama,
            nim,
            angkatan,
            email,
            no_hp,
            proof
        } = req.body

        await MalpunDB.query().insert({
            nama,
            nim,
            angkatan,
            email,
            no_hp,
            proof
        }) 

        return res.status(200).send({ message: 'Registrasi Malam Puncak Berhasil' })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}