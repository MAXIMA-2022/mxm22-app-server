const CDialDB = require('../models/chaptersDial.models')
const helper = require('../../helpers/helper')

exports.readAllChapter = async(req, res) => {
    try{
        const result = await CDialDB.query()
        return res.status(200).send(result)
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.createChapter = async(req, res) => {
    try {
        const {
            homeChapterID,
            name
        } = req.body

        const authorizedDiv = ['D01', 'D02', 'D04']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }
        
        const fixName = helper.toTitleCase(name).trim()

        const cekCID = await CDialDB.query().where({ homeChapterID })
        if(cekCID.length !== 0 && cekCID !== []){
            return res.status(403).send({ 
                message: 'Chapter Dialogues sudah terdaftar!'
            })
        }

        const cekCName = await CDialDB.query().where({ name })
        if(cekCName.length !== 0 && cekCName !== []){
            return res.status(403).send({ 
                message: 'Nama Chapter Dialogues sudah terdaftar!'
            })
        }

        await CDialDB.query().insert({
            homeChapterID,
            name: fixName
        })

        return res.status(200).send({ 
            message: 'Chapter Dialogues baru berhasil ditambahkan'
        })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateChapter = async(req, res) => {
    try{
        const { homeChapterID } = req.params
        const { name } = req.body

        const authorizedDiv = ['D01', 'D02', 'D04']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        if(homeChapterID === null || homeChapterID === ':homeChapterID'){
            return res.status(404).send({
                message: 'Chapter Dialouges ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const cekCID = await CDialDB.query().where({ homeChapterID })
        if(cekCID.length === 0 || cekCID === []){
            return res.status(404).send({ 
                message: 'Chapter Dialogues: ' + homeChapterID + ' tidak ditemukan!'
            })
        }

        const fixName = helper.toTitleCase(name).trim()

        await CDialDB.query().update({ name: fixName }).where({ homeChapterID })

        return res.status(200).send({
            message: 'Data berhasil diubah'
        })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.deleteChapter = async(req, res) => {
    try {
        const { homeChapterID } = req.params
        const authorizedDiv = ['D01', 'D02', 'D04']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }
        
        if(homeChapterID === null || homeChapterID === ':homeChapterID'){
            return res.status(404).send({
                message: 'Chapter Dialouges ID kosong! Harap diisi terlebih dahulu'
            })
        }
        
        const cekChapter = await CDialDB.query().where({ homeChapterID })
        if(cekChapter.length === 0 || cekChapter === []){
            return res.status(404).send({
                message: 'Chapter Dialogues: ' + homeChapterID + ' tidak ditemukan!'
            })
        }

        await CDialDB.query().delete().where({ homeChapterID })

        return res.status(200).send({
            message: 'Data berhasil dihapus!'
        })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}