const sActDB = require('../model/state_activities.model')
const dayManDB = require('../model/day_management.model')
const helper = require('../../helpers/helper')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename:
    'keys/mxm22-bucket.json' })

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


exports.readAllState = async(req, res) => {
    try {
        const result = await sActDB.query()
        return res.status(200).send(result)      
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readSpecificState = async(req, res) => {
    try {
        const { stateID } = req.params

        const cekSTATE = await sActDB.query().where({ stateID })
        if(cekSTATE.length === 0 || cekSTATE === []){
            return res.status(404).send({
                 message: 'STATE ID ' + stateID + ' tidak ditemukan!' 
            })
        }
        const result = await sActDB.query().where({ stateID })
        return res.status(200).send(result)
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readPublicState = async(req, res) => {
    try{
        const result = await sActDB.query().select(
            'state_activities.stateID', 
            'state_activities.name', 
            'state_activities.stateLogo',
            'state_activities.quota',
            'state_activities.registered',
            'day_management.date'
        )
        .join(
            'day_management',
            'day_management.day',
            'state_activities.day'
        )

        return res.status(200).send(result)
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.createState = async(req, res) => {
    try{
        const authorizedDiv = ['D01', 'D02', 'D03', 'D04']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const { 
            name, 
            day,
            quota,
            identifier, 
            category, 
            shortDesc
        } = req.body

        const { stateLogo, coverPhoto } = req.files

        const fixName = helper.toTitleCase(name).trim()
        const attendanceCode = helper.createAttendanceCode(name)
        const attendanceCode2 = helper.createAttendanceCode(name)
 
        const uuidLogo = uuidv4()
        const uuidCover = uuidv4()

        const stateName = fixName.trim().split(' ').join('-')
        
        const extnameLogo = path.extname(stateLogo.name)
        const basenameLogo = path.basename(stateLogo.name, extnameLogo).trim().split(' ').join('-')
        const extnameCover = path.extname(coverPhoto.name)
        const basenameCover = path.basename(coverPhoto.name, extnameCover).trim().split(' ').join('-')

        const fileNameLogo = `${stateName}_${uuidLogo}_${basenameLogo}${extnameLogo}`
        const fileNameCover = `${stateName}_${uuidCover}_${basenameCover}${extnameCover}`
    
        const uploadPathLogo = 'stateLogo/' + fileNameLogo
        const uploadPathCover = 'stateLogo/' + fileNameCover

        const bucketName = 'mxm22-bucket-test'

        const urlFileLogo = `https://storage.googleapis.com/${bucketName}/${fileNameLogo}`
        const urlFileCover = `https://storage.googleapis.com/${bucketName}/${fileNameCover}`

        const cekStateName = await sActDB.query().where({ name:fixName })
        if(cekStateName.length !== 0 && cekStateName !== []){
            return res.status(409).send({ 
                message: `STATE ${fixName} sudah terdaftar sebelumnya! Silahkan periksa kembali`
            })
        } 

        const cekDay = await dayManDB.query().where({ day })
        if(cekDay.length === 0 || cekDay === []){
            return res.status(404).send({ 
                message: `Value day: ${day}, tidak tersedia!`
            })
        }

        await sActDB.query().insert({
            name: fixName,
            day,
            stateLogo: urlFileLogo,
            quota,
            registered : 0,
            attendanceCode,
            attendanceCode2,
            identifier,
            category,
            shortDesc,
            coverPhoto: urlFileCover
        })

        stateLogo.mv(uploadPathLogo, async (err) => {
            if (err)
                return res.status(500).send({ message: err.messsage })
                            
            await storage.bucket(bucketName).upload(uploadPathLogo)
            fs.unlink(uploadPathLogo, (err) => {
                if (err) {
                    return res.status(500).send({ message: err.messsage })
                }        
            })
        })
      
        coverPhoto.mv(uploadPathCover, async(err) => {
            if (err)
                return res.status(500).send({ message: err.messsage })
                            
            await storage.bucket(bucketName).upload(uploadPathCover)
            fs.unlink(uploadPathCover, (err) => {
                if (err)
                    return res.status(500).send({ message: err.messsage })
            })
        })
        
        return res.status(200).send({ message: 'STATE baru berhasil ditambahkan' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateState = async(req, res) => {
    try{
        const { stateID } = req.params
        const { 
            name, 
            day, 
            quota,
            identifier, 
            category, 
            shortDesc
        } = req.body

        const { stateLogo, coverPhoto } = req.files
        const fixName = helper.toTitleCase(name).trim()

        const authorizedDiv = ['D01', 'D02']
        const division = req.division    
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekSTATE = await sActDB.query().where({ stateID })
        if(cekSTATE.length === 0 || cekSTATE === []){
            return res.status(404).send({ 
                message: 'STATE ID ' + stateID + ' tidak ditemukan' 
            })
        }

        const cekDay = await dayManDB.query().where({ day })
        if(cekDay.length === 0 || cekDay === []){
            return res.status(404).send({ 
                message: `Value day: ${day}, tidak tersedia!`
            })
        }

        //File Upload
        const stateName = fixName.trim().split(' ').join('-')

        if(!req.files || !stateLogo)
            res.status(400).send({ message: 'Logo STATE tidak boleh kosong!' })
        
        if(!req.files || !coverPhoto)
            res.status(400).send({ message: 'Cover Photo STATE tidak boleh kosong!' })
        
        const extnameLogo = path.extname(stateLogo.name)
        const basenameLogo = path.basename(stateLogo.name, extnameLogo).trim().split(' ').join('-')
        const extnameCover = path.extname(coverPhoto.name)
        const basenameCover = path.basename(coverPhoto.name, extnameCover).trim().split(' ').join('-')
        
        //logo
        const uuidLogo = uuidv4()
        fileNameLogo = `${stateName}_${uuidLogo}_${basenameLogo}${extnameLogo}`
        uploadPathLogo = './stateLogo/' + fileNameLogo
        bucketName = 'mxm22-bucket-test'
        urlFileLogo = `https://storage.googleapis.com/${bucketName}/${fileNameLogo}`

        //cover
        uuidCover = uuidv4()
        fileNameCover = `${stateName}_${uuidCover}_${basenameCover}${extnameCover}`
        uploadPathCover = './stateLogo/' + fileNameCover
        bucketName = 'mxm22-bucket-test'
        urlFileCover = `https://storage.googleapis.com/${bucketName}/${fileNameCover}`

        const cekRegistered = await sActDB.query().where({ stateID })
        if(parseInt(quota) < cekRegistered[0].registered ){
            return res.status(409).send({
                message: 'Jumlah Quota STATE lebih sedikit daripada jumlah yang telah mendaftar'
            })
        }
        
        // const cekStateName = await sActDB.query().where({ name:fixName })
        // if(cekStateName.length !== 0 && cekStateName !== [] && cekStateName !== null && cekStateName !== undefined){
        //     return res.status(409).send({ 
        //         message: `STATE ${fixName} sudah terdaftar sebelumnya! Silahkan periksa kembali`
        //     })
        // }

        const attCode = helper.createAttendanceCode(name.trim().split(' ').join('-'))
        const attCode2 = helper.createAttendanceCode(name.trim().split(' ').join('-'))
        
        await sActDB.query().update({
            name: fixName,
            day,
            stateLogo: urlFileLogo,
            quota,
            registered,
            attendanceCode: attCode,
            attendanceCode2: attCode2,
            identifier,
            category,
            shortDesc,
            coverPhoto: urlFileCover
        }).where({ stateID })

        stateLogo.mv(uploadPathLogo, async (err) => {
            if (err)
                return res.status(500).send({ message: err.messsage })
                            
            await storage.bucket(bucketName).upload(uploadPathLogo)
      
            fs.unlink(uploadPathLogo, (err) => {
                if (err)
                    return res.status(500).send({ message: err.messsage })                    
            })
        })
      
        coverPhoto.mv(uploadPathCover, async(err) => {
            if (err)
                return res.status(500).send({ message: err.messsage })
                            
            await storage.bucket(bucketName).upload(uploadPathCover)
      
            fs.unlink(uploadPathCover, (err) => {
                if (err)
                    return res.status(500).send({ message: err.messsage })
            })
        })
        
        return res.status(200).send({ message: 'STATE berhasil diupdate' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.deleteState = async(req, res) => {
    try{
        const { stateID } = req.params
        const authorizedDiv = ['D01', 'D02', 'D03']
        const division = req.division
       
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekSTATE = await sActDB.query().where({ stateID })
        if(cekSTATE.length === 0 || cekSTATE === []){
            return res.status(404).send({ 
                message: 'STATE ID ' + stateID + ' tidak ditemukan'
            })
        }

        await sActDB.query().delete().where({ stateID })
        return res.status(200).send({ message: 'STATE berhasil dihapus' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}