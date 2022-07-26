const HInfoDB = require('../models/homeInfo.model')
const CDialDB = require('../../chapters/models/chaptersDial.models')
const HMediaDB = require('../models/homeMedia.model')
const helper = require('../../helpers/helper')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename:
    'keys/mxm22-bucket.json' })

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


exports.readAllHInfo = async(req, res) => {
    try{
        let homeResult = await HInfoDB.query()

        for(let i = 0; i < homeResult.length; i++){
            const mediaResult = await HMediaDB.query()
            .select('photoID', 'linkMedia')
            .where({ homeID: homeResult[i].homeID })

            homeResult[i].media = mediaResult
        }
        
        return res.status(200).send(homeResult)
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.readSpecificHInfo = async(req, res) => {
    try{
        const { param } = req.params

        const cekHomeByName = await HInfoDB.query().where({ name: param })
        const cekHomeByChapter = await HInfoDB.query().where({ chapter: param })
        if((cekHomeByName.length === 0 || cekHomeByName === []) && (cekHomeByChapter.length === 0 || cekHomeByChapter === [])){
            return res.status(404).send({ 
                message: 'Informasi HoME tidak ditemukan!'
            })
        }
        
        let cekHome = ''
        if(cekHomeByName.length !== 0 && cekHomeByName !== [])
            cekHome = await HInfoDB.query().where({ name: param })
                
        if(cekHomeByChapter.length !== 0 && cekHomeByChapter !== [])
            cekHome = await HInfoDB.query().where({ chapter: param })


        return res.status(200).send(cekHome)
        
        // let homeResult = await HInfoDB.query().where({ homeID: cekHome[0].homeID })
        // for(let i = 0; i < homeResult.length; i++){
        //     const mediaResult = await HMediaDB.query()
        //     .select('photoID', 'linkMedia')
        //     .where({ homeID: homeResult[0].homeID })

        //     homeResult[i].media = mediaResult
        // }

        // let homeResult = ''
        // let homeMed = ''
        // for(let i = 0; i < cekHome.length; i++){
        //     homeResult = await HInfoDB.query().where({ homeID: cekHome[i].homeID })
        //     homeMed = await HMediaDB.query().where({ homeID: homeResult[0].homeID})
        //     for(let j = 0; j < homeMed.length; j++){
        //         const mediaResult = await HMediaDB.query()
        //         .select('photoID', 'linkMedia')
        //         .where({ homeID: homeMed[j].homeID })

        //         homeResult[i].media = mediaResult 
        //     }     
        // }
        
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.createHInfo = async(req, res) => {
    try{
        const authorizedDiv = ['D01', 'D02', 'D04']
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

        const cekChapter = await CDialDB.query().where({ homeChapterID: chapter })
        if(cekChapter.length === 0 || cekChapter === []){
            return res.status(409).send({ 
                message: `Chapter Dialogue ID ${chapter} tidak ditemukan!`
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
        const authorizedDiv = ['D01', 'D02', 'D04']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const { homeID } = req.params
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

        if(!req.files || !linkLogo)
            res.status(400).send({ message: 'Logo HoME tidak boleh kosong!' })
            
        const extnameLogo = path.extname(linkLogo.name)
        const basenameLogo = path.basename(linkLogo.name, extnameLogo).trim().split(' ').join('-')

        const uuidLogo = uuidv4()
        const homeIName = fixName.trim().split(' ').join('-')
        const fileNameLogo = `${homeIName}_${uuidLogo}_${basenameLogo}${extnameLogo}`
        const uploadPathLogo = './homeLogo/' + fileNameLogo
        const bucketName = 'mxm22-bucket-test'
        const urlFileLogo = `https://storage.googleapis.com/${bucketName}/${fileNameLogo}`

        const cekHInfo = await HInfoDB.query().where({ homeID })
        if(cekHInfo.length === 0 || cekHInfo === []){
            return res.status(404).send({ 
                message: 'HoME ID ' + homeID + ' tidak ditemukan!' 
            })
        }

        const cekChapter = await CDialDB.query().where({ homeChapterID: chapter })
        if(cekChapter.length === 0 || cekChapter === []){
            return res.status(409).send({ 
                message: `Chapter Dialogue ID ${chapter} tidak ditemukan!`
            })
        }

        await HInfoDB.query().update({
            search_key,
            linkLogo: urlFileLogo,
            name: fixName,
            chapter,
            shortDesc,
            longDesc,
            instagram,
            lineID,
            linkYoutube
        }).where({ homeID })

        linkLogo.mv(uploadPathLogo, async (err) => {
            if (err)
                return res.status(500).send({ message: err.messsage })
                            
            await storage.bucket(bucketName).upload(uploadPathLogo)
      
            fs.unlink(uploadPathLogo, (err) => {
                if (err)
                    return res.status(500).send({ message: err.messsage })                    
            })
        })

        return res.status(200).send({ message: 'Data HoME berhasil diupdate' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.deleteHInfo = async(req, res) => {
    try{
        const { homeID } = req.params
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

        await HInfoDB.query().delete().where({ homeID })
        return res.status(200).send({ message: 'HoME berhasil dihapus' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}