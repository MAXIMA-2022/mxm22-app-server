const sActDB = require('../model/state_activities.model')
const dayManDB = require('../model/day_management.model')
const helper = require('../../helpers/helper')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename:
    'keys/mxm22-bucket.json' })

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

exports.readState = async(req, res) => {
    try {
        const result = await sActDB.query().select('stateID', 'name')
        return res.status(200).send(result)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readAllState = async(req, res) => {
    try {
        const result = await sActDB.query()
        for(let i = 0; i < result.length; i++){
            const dateTime = await dayManDB.query().select('date').where({ day: result[i].day })                

            let date = new Date(dateTime[0].date).toUTCString()
            date = date.split(' ').slice(0, 4).join(' ')

            result[i].date = date
        }

        return res.status(200).send(result)      
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.readSpecificState = async(req, res) => {
    try {
        const { stateID } = req.params

        if(stateID === null || stateID === ':stateID'){
            return res.status(404).send({
                message: 'STATE ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const cekSTATE = await sActDB.query().where({ stateID })
        if(cekSTATE.length === 0 || cekSTATE === []){
            return res.status(404).send({
                 message: 'STATE ID ' + stateID + ' tidak ditemukan!' 
            })
        }

        const result = await sActDB.query().where({ stateID })
        const dateTime = await dayManDB.query().select('date').where({ day: result[0].day })                

        let date = new Date(dateTime[0].date).toUTCString()
        date = date.split(' ').slice(0, 4).join(' ')
        result[0].date = date

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
       
        for(let i = 0; i < result.length; i++){            
            let date = new Date(result[i].date).toUTCString();
            date = date.split(' ').slice(0, 4).join(' ');

            result[i].date = date
        }

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
            quota
        } = req.body

        const { stateLogo } = req.files

        const fixName = helper.toTitleCase(name).trim()
        const attendanceCode = helper.createAttendanceCode(name)
        const attendanceCode2 = helper.createAttendanceCode(name)
 
        const uuidLogo = uuidv4()

        const stateName = fixName.trim().split(' ').join('-')
        
        const extnameLogo = path.extname(stateLogo.name)
        const basenameLogo = path.basename(stateLogo.name, extnameLogo).trim().split(' ').join('-')

        const fileNameLogo = `${stateName}_${uuidLogo}_${basenameLogo}${extnameLogo}`
    
        const uploadPathLogo = 'stateLogo/' + fileNameLogo

        const bucketName = 'mxm22-bucket-test'

        const urlFileLogo = `https://storage.googleapis.com/${bucketName}/${fileNameLogo}`

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
            name,
            day,
            stateLogo: urlFileLogo,
            quota,
            registered : 0,
            attendanceCode,
            attendanceCode2
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
      
        
        return res.status(200).send({ message: 'STATE baru berhasil ditambahkan' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateState = async(req, res) => {
    try{
        const { stateID } = req.params

        if(stateID === null || stateID === ':stateID'){
            return res.status(404).send({
                message: 'STATE ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const { 
            name, 
            day, 
            quota
        } = req.body

        
        const fixName = helper.toTitleCase(name).trim()

        const authorizedDiv = ['D01', 'D02', 'D03', 'D04']
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

        const cekRegistered = await sActDB.query().where({ stateID })
        if(parseInt(quota) < cekRegistered[0].registered ){
            return res.status(409).send({
                message: 'Jumlah Quota STATE lebih sedikit daripada jumlah yang telah mendaftar'
            })
        }

        const attCode = helper.createAttendanceCode(name.trim().split(' ').join('-'))
        const attCode2 = helper.createAttendanceCode(name.trim().split(' ').join('-'))

        if(req.files && req.files.stateLogo){
            //File Upload
            const stateLogo = req.files.stateLogo
            const stateName = fixName.trim().split(' ').join('-')

            const extnameLogo = path.extname(stateLogo.name)
            const basenameLogo = path.basename(stateLogo.name, extnameLogo).trim().split(' ').join('-')

            //logo
            const uuidLogo = uuidv4()
            fileNameLogo = `${stateName}_${uuidLogo}_${basenameLogo}${extnameLogo}`
            uploadPathLogo = './stateLogo/' + fileNameLogo
            bucketName = 'mxm22-bucket-test'
            urlFileLogo = `https://storage.googleapis.com/${bucketName}/${fileNameLogo}`


            await sActDB.query().update({
                name,
                day,
                stateLogo: urlFileLogo,
                quota,
                attendanceCode: attCode,
                attendanceCode2: attCode2,
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
          
            
            return res.status(200).send({ message: 'STATE berhasil diupdate' })
        }
        
        await sActDB.query().update({
            name,
            day,
            quota,
            attendanceCode: attCode,
            attendanceCode2: attCode2
        }).where({ stateID })

        
        return res.status(200).send({ message: 'STATE berhasil diupdate' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.deleteState = async(req, res) => {
    try{
        const { stateID } = req.params

        if(stateID === null || stateID === ':stateID'){
            return res.status(404).send({
                message: 'STATE ID kosong! Harap diisi terlebih dahulu'
            })
        }

        const authorizedDiv = ['D01', 'D02', 'D03', 'D04']
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