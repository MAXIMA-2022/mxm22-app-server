const sActDB = require('../model/state_activities.model')
const helper = require('../../helpers/helper')

exports.readAllState = async(req, res) => {
    try {
        const result = await sActDB.query()
        return res.status(200).send(result)      
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.readSpecificState = async(req, res) => {
    const { stateID } = req.params
    const cekSTATE = await sActDB.query().where({ stateID })
    
    if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null && cekSTATE !== undefined){
        const result = await sActDB.query().where({ stateID })

        return res.status(200).send(result)
    }
    else
        return res.status(404).send({ message: 'STATE ID ' + stateID + ' tidak ditemukan' })
}


exports.createState = async(req, res) => {
    const authorizedDiv = ['D01', 'D02', 'D03', 'D04']
    const division = req.division
    
    try{
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }
        
        const { 
            name, 
            zoomLink, 
            day, 
            stateLogo, 
            quota,
            identifier, 
            category, 
            shortDesc, 
            coverPhoto 
        } = req.body

        const fixName = helper.toTitleCase(name).trim()
        const attendanceCode = helper.createAttendanceCode(name)
        const attendanceCode2 = helper.createAttendanceCode(name)

        await sActDB.query().insert({
            name: fixName,
            zoomLink,
            day,
            stateLogo,
            quota,
            registered : 0,
            attendanceCode,
            attendanceCode2,
            identifier,
            category,
            shortDesc,
            coverPhoto
        })
        
        return res.status(200).send({ message: 'STATE baru berhasil ditambahkan' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.updateState = async(req, res) => {
    const { stateID } = req.params

    try{
        const { 
            name, 
            zoomLink, 
            day, 
            stateLogo, 
            quota, 
            registered, 
            attendanceCode, 
            identifier, 
            category, 
            shortDesc, 
            coverPhoto 
        } = req.body
        const cekSTATE = await sActDB.query().where({ stateID })

        if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null && cekSTATE !== undefined){
            await sActDB.query().update({
                name,
                zoomLink,
                day,
                stateLogo,
                quota,
                registered,
                attendanceCode,
                identifier,
                category,
                shortDesc,
                coverPhoto
            }).where({ stateID })
            
            return res.status(200).send({ message: 'STATE berhasil diupdate' })
        }
        else
            return res.status(404).send({ message: 'STATE ID ' + stateID + ' tidak ditemukan' })
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}

exports.deleteState = async(req, res) => {
    const { stateID } = req.params

    try{
        const cekSTATE = await sActDB.query().where({ stateID })

        if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null && cekSTATE !== undefined){
            await sActDB.query().delete().where({ stateID })

            return res.status(200).send({ message: 'STATE berhasil dihapus' })
        }
        else
            return res.status(404).send({ message: 'STATE ID ' + stateID + ' tidak ditemukan' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}