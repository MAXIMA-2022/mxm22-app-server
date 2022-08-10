const HMediaDB = require('../models/homeMedia.model')
const HInfoDB = require('../models/homeInfo.model')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename:
    'keys/mxm22-bucket.json' })

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

exports.readAllHMedia = async (req, res) =>{
    try {
        const result = await HMediaDB.query()

        for(let i = 0; i < result.length; i++){
            const hName = await HInfoDB.query().select('name').where({ homeID: result[i].homeID })

            result[i].homeName = hName[0].name
        }

       return res.status(200).send(result)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.specificByPhotoID = async (req, res) =>{
    try {
        const { photoID } = req.params

        if(photoID === null || photoID === ':photoID'){
            return res.status(404).send({
                message: 'Photo ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const cekHomeMedia = await HMediaDB.query().where({ photoID })
        if(cekHomeMedia.length === 0 || cekHomeMedia === []){
            return res.status(404).send({
                message: "Media HoME tidak ditemukan!"
            })
        }

        const result = await HMediaDB.query().where({ photoID })
        const hName = await HInfoDB.query().select('name').where({ homeID: result[0].homeID })
        result[0].homeName = hName[0].name

        return res.status(200).send(result)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.specificByHomeID = async(req, res) =>{
    try {
        const { homeID } = req.params

        const authorizedDiv = ['D01', 'D02', 'D04']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        if(homeID === null || homeID === ':homeID'){
            return res.status(404).send({
                message: 'Home ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const cekMedia = await HMediaDB.query().where({ homeID })
        if(cekMedia.length === 0 || cekMedia === []){
            return res.status(404).send({
                message: `Media dari HoME ID ${homeID} tidak ditemukan!`
            })
        }

        const result = await HMediaDB.query().where({ homeID })
        for(let i = 0; i < result.length; i++){
            const hName = await HInfoDB.query().select('name').where({ homeID: result[i].homeID })

            result[i].homeName = hName[0].name
        }

        return res.status(200).send(result)

    } catch (err) {
        return res.status(500).send({ message: err.message })
    }

}

exports.createNewHMedia = async (req,res) => {
    try {
        const { homeID } = req.body
        const authorizedDiv = ['D01', 'D02', 'D04']
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
        
        let { linkMedia } = req.files
        const bucketName = 'mxm22-bucket-test'
        const homeInfo = await HInfoDB.query().where({ homeID })
        const mediaFileName = []
        const mediaUploadPath = []
        const mediaUrlFile = []

        if (linkMedia && linkMedia.length === undefined)
            linkMedia = [linkMedia]
                
        for (let i = 0; i < linkMedia.length; i++) {
            const mediaUuid = uuidv4()
            const homeName = homeInfo[0].name.trim().split(' ').join('-')
            const mediaName = linkMedia[i].name.trim().split(' ').join('-')

            mediaFileName.push(`${homeName}_${mediaUuid}_${mediaName}`)
            mediaUploadPath.push(`./homeMedia/${mediaFileName[i]}`)
            mediaUrlFile.push(`https://storage.googleapis.com/${bucketName}/${mediaFileName[i]}`)
        }
        
        for (let i = 0; i < mediaUploadPath.length; i++){
            await HMediaDB.query().insert({
                homeID,
                linkMedia: mediaUrlFile[i]
            })

            linkMedia[i].mv(mediaUploadPath[i], async (err) =>{
                if(err)
                    return res.status(500).send({ message: err.message })
                
                await storage.bucket(bucketName).upload(mediaUploadPath[i])
                fs.unlink(mediaUploadPath[i], (err) =>{
                    if(err){
                        return res.status(500).send({ message: err.message })
                    }
                })
            })
        }
        
        return res.status(200).send({message: 'Media HoME baru berhasil ditambahkan' })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.deleteHMedia = async(req, res) => {
    try{
        const { photoID } = req.params

        if(photoID === null || photoID === ':photoID'){
            return res.status(404).send({
                message: 'Photo ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const authorizedDiv = ['D01', 'D02', 'D04']
        const division = req.division
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekHInfo = await HMediaDB.query().where({ photoID })
        if(cekHInfo.length === 0 || cekHInfo === []){
            return res.status(404).send({ 
                message: 'Media HoME tidak ditemukan!'
            })
        }

        await HMediaDB.query().delete().where({ photoID })
        return res.status(200).send({ message: 'Media HoME berhasil dihapus' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}