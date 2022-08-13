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

            const chapterName = await CDialDB.query().select('name')
            .where({ homeChapterID: homeResult[i].chapter })

            homeResult[i].chapterName = chapterName[0].name
            homeResult[i].media = mediaResult
        }
        
        return res.status(200).send(homeResult)
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.specificHomeBySearchKey = async(req, res) => {
    try {
        const { search_key } = req.params

        if(search_key === null || search_key === ':search_key'){
            return res.status(404).send({
                message: 'Search Key kosong! Harap diisi terlebih dahulu'
            })
        }

        const fixKey = (search_key.toLowerCase().replace(/\(/g, '').replace(/\)/g, '').replace(/\./g, '').replace(/\'/g, '').replace(/\&/, 'and').split(' ').join('-'))

        const cekHome = await HInfoDB.query().where({ search_key: fixKey })
        if(cekHome.length === 0 || cekHome === []){
            return res.status(404).send({
                message: 'Informasi HoME tidak ditemukan!'
            })
        }

        let homeResult = await HInfoDB.query().where({ search_key: fixKey })
        for(let i = 0; i < homeResult.length; i++){
            const mediaResult = await HMediaDB.query()
            .select('linkMedia')
            .where({ homeID: homeResult[i].homeID })

            const mediaArray = []

            for(let j = 0; j < mediaResult.length; j++){
                mediaArray.push(mediaResult[j].linkMedia)
            }    

            const chapterName = await CDialDB.query().select('name')
            .where({ homeChapterID: homeResult[i].chapter })

            homeResult[i].chapterName = chapterName[0].name
            homeResult[i].media = mediaArray
        }
        
        return res.status(200).send(homeResult)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.specificHomeByChapter = async(req, res) => {
    try {
        const { chapterName } = req.params

        if(chapterName === null || chapterName === ':chapterName'){
            return res.status(404).send({
                message: 'chapter kosong! Harap diisi terlebih dahulu'
            })
        }

        const cekChapter = await CDialDB.query().where({ name: chapterName })
        if(cekChapter.length === 0 || cekChapter === []){
            return res.status(404).send({
                message: 'Informasi HoME tidak ditemukan!'
            })
        }

        let homeResult = await HInfoDB.query()
        .select('home_information.*')
        .join(
            'chapter_dialogues',
            'chapter_dialogues.homeChapterID',
            'home_information.chapter')
        .where('chapter_dialogues.name', chapterName)    

        for(let i = 0; i < homeResult.length; i++){
            const mediaResult = await HMediaDB.query()
            .select('photoID', 'linkMedia')
            .where({ homeID: homeResult[i].homeID })

            
            const chapterName = await CDialDB.query().select('name')
            .where({ homeChapterID: homeResult[i].chapter })

            homeResult[i].chapterName = chapterName[0].name
            homeResult[i].media = mediaResult
        }
        
        return res.status(200).send(homeResult)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.specificHomeByID = async(req, res) => {
    try {
        const { homeID } = req.params

        if(homeID === null || homeID === ':homeID'){
            return res.status(404).send({
                message: 'HoME ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const cekID = await HInfoDB.query().where({ homeID })
        if(cekID.length === 0 || cekID === []){
            return res.status(404).send({
                message: 'Informasi HoME tidak ditemukan!'
            })
        }

        let homeResult = await HInfoDB.query().where({ homeID })
        for(let i = 0; i < homeResult.length; i++){
            const mediaResult = await HMediaDB.query()
            .select('photoID', 'linkMedia')
            .where({ homeID: homeResult[i].homeID })

            const chapterName = await CDialDB.query().select('name')
            .where({ homeChapterID: homeResult[i].chapter })

            homeResult[i].chapterName = chapterName[0].name
            homeResult[i].media = mediaResult
        }
        
        return res.status(200).send(homeResult)
    } 
    catch (err) {
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
            name,
            chapter,
            shortDesc,
            longDesc,
            linkInstagram,
            linkLine,
            linkYoutube,
            linkFacebook,
            linkTwitter,
            linkTiktok,
            linkLinkedIn
        } = req.body

        const { linkLogo } = req.files

        const videoID = helper.generateVideoID(linkYoutube)
        const fixName = helper.toTitleCase(name).trim()
        const searchKey = (fixName.toLowerCase().replace(/\(/g, '').replace(/\)/g, '').replace(/\./g, '').replace(/\'/g, '').replace(/\&/, 'and').split(' ').join('-'))
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
            search_key: searchKey,
            linkLogo: urlFileLogo,
            name: fixName,
            chapter,
            shortDesc,
            longDesc,
            linkInstagram,
            linkLine,
            linkYoutube: `https://www.youtube.com/embed/${videoID}`,
            linkFacebook,
            linkTwitter,
            linkTiktok,
            linkLinkedIn
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
        if(homeID === null || homeID === ':homeID'){
            return res.status(404).send({
                message: 'HoME ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const {
            name,
            chapter,
            shortDesc,
            longDesc,
            linkInstagram,
            linkLine,
            linkYoutube,
            linkFacebook,
            linkTwitter,
            linkTiktok,
            linkLinkedIn
        } = req.body

        const videoID = helper.generateVideoID(linkYoutube)
        const fixName = helper.toTitleCase(name).trim()
        const searchKey = (fixName.toLowerCase().replace(/\(/g, '').replace(/\)/g, '').replace(/\./g, '').replace(/\'/g, '').replace(/\&/, 'and').split(' ').join('-'))

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


        if(req.files && req.files.linkLogo){
            const linkLogo  = req.files.linkLogo
           
            const extnameLogo = path.extname(linkLogo.name)
            const basenameLogo = path.basename(linkLogo.name, extnameLogo).trim().split(' ').join('-')

            const uuidLogo = uuidv4()
            const homeIName = fixName.trim().split(' ').join('-')
            const fileNameLogo = `${homeIName}_${uuidLogo}_${basenameLogo}${extnameLogo}`
            const uploadPathLogo = './homeLogo/' + fileNameLogo
            const bucketName = 'mxm22-bucket-test'
            const urlFileLogo = `https://storage.googleapis.com/${bucketName}/${fileNameLogo}`


            await HInfoDB.query().update({
                search_key: searchKey,
                linkLogo: urlFileLogo,
                name: fixName,
                chapter,
                shortDesc,
                longDesc,
                linkInstagram,
                linkLine,
                linkYoutube: `https://www.youtube.com/embed/${videoID}`,
                linkFacebook,
                linkTwitter,
                linkTiktok,
                linkLinkedIn
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


        await HInfoDB.query().update({
            search_key: searchKey,
            name: fixName,
            chapter,
            shortDesc,
            longDesc,
            linkInstagram,
            linkLine,
            linkYoutube: `https://www.youtube.com/embed/${videoID}`,
            linkFacebook,
            linkTwitter,
            linkTiktok,
            linkLinkedIn
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

        if(homeID === null || homeID === ':homeID'){
            return res.status(404).send({
                message: 'HoME ID kosong! Harap diisi terlebih dahulu'
            })
        }
        
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