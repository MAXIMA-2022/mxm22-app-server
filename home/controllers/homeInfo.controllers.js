const HInfoDB = require('../models/homeInfo.model')
const helper = require('../../helpers/helper')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename:
    'keys/mxm22-bucket.json' })

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


exports.readAllHInfo = async(req, res) => {
    try{
        const result = await HInfoDB.query()
        return res.status(200).send(result)
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.readSpecificHInfo = async(req, res) => {
    try{
        const { homeID } = req.params

        const cekHome = await HInfoDB.query().where({ homeID })
        if(cekHome.length === 0 || cekHome === []){
            return res.status(404).send({ 
                message: 'Informasi HoME tidak ditemukan!'
            })
        }
        
        const result = await HInfoDB.query().where({ homeID })
        return res.status(200).send(result) 
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.createHInfo = async(req, res) => {
    try{
        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const {
            search_key,
            name,
            chapter,
            shortDesc,
            longDesc,
            instagram,
            lineID,
            linkYoutube
        } = req.body

        const { linkLogo } = req.files
        const fixName = helper.toTitleCase(name).trim()
        const uuidLogo = uuidv4()

        const homeIName = fixName.trim().split(' ').join('-')
        const extnameLogo = path.extname(linkLogo.name)
        const basenameLogo = path.basename(linkLogo.name, extnameLogo).trim().split(' ').join('-')

        const fileNameLogo = `${homeIName}_${uuidLogo}_${basenameLogo}${extnameLogo}`
        const uploadPathLogo = './homeLogo/' + fileNameLogo
        const bucketName = 'mxm22-bucket-test'
        const urlFileLogo = `https://storage.googleapis.com/${bucketName}/${fileNameLogo}`

        const cekHInfo = await HInfoDB.query().where({ name })
        if(cekHInfo.length !== 0 && cekHInfo !== []){
            return res.status(409).send({ 
                message: `HoME ${name} sudah terdaftar sebelumnya! Silahkan periksa kembali`
            })
        } 

        await HInfoDB.query().insert({
            search_key,
            linkLogo: urlFileLogo,
            name: fixName,
            chapter,
            shortDesc,
            longDesc,
            instagram,
            lineID,
            linkYoutube
        })

        linkLogo.mv(uploadPathLogo, async (err) => {
            if (err)
                return res.status(500).send({ message: err.messsage })
                            
            await storage.bucket(bucketName).upload(uploadPathLogo)
            fs.unlink(uploadPathLogo, (err) => {
                if (err) {
                    return res.status(500).send({ message: err.messsage })
                }        
            })
        })

        return res.status(200).send({ message: 'HoME baru berhasil ditambahkan' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.updateHInfo = async(req, res) => {
    try{
        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const { homeID } = req.params
        const {
            search_key,
            linkLogo, //foto blm
            name,
            chapter,
            shortDesc,
            longDesc,
            instagram,
            lineID,
            linkYoutube
        } = req.body

        const cekHInfo = await HInfoDB.query().where({ homeID })
        if(cekHInfo.length === 0 || cekHInfo === []){
            return res.status(404).send({ 
                message: 'HoME ID ' + homeID + ' tidak ditemukan!' 
            })
        }

        const fixName = helper.toTitleCase(name).trim()
        await HInfoDB.query().update({
            search_key,
            linkLogo, //foto blm
            name: fixName,
            chapter,
            shortDesc,
            longDesc,
            instagram,
            lineID,
            linkYoutube
        }).where({ homeID })

        return res.status(200).send({ message: 'Data HoME berhasil diupdate' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.deleteHInfo = async(req, res) => {
    try{
        const { homeID } = req.params
        const authorizedDiv = ['D01', 'D02']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekHInfo = await HInfoDB.query().where({ homeID })
        if(cekHInfo.length === 0 || cekHInfo === []){
            return res.status(404).send({ 
                message: 'HoME ID ' + homeID + ' tidak ditemukan!'
            })
        }

        await HInfoDB.query().delete().where({ homeID })
        return res.status(200).send({ message: 'HoME berhasil dihapus' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}