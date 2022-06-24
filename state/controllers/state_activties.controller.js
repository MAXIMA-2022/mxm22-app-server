const sActDB = require('../model/state_activities.model')

exports.readAllState = async(req, res) => {
    const result = await sActDB.query()
    return res.status(200).send(result)
}
exports.readSpecificState = async(req, res) => {
    const { stateID } = req.params
    const cekSTATE = await sActDB.query().where({ stateID: stateID })
    
    if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null){
        const result = await sActDB.query().where({ 
            stateID: stateID
        })

        return res.status(200).send(result)
    }
    else
        return res.status(404).send({message: 'STATE ID ' + stateID + ' tidak ditemukan'})
}


exports.createState = async(req, res) => {
    try{
        const { name, zoomLink, day, stateLogo, quota, registered, attendanceCode, identifier, category, shortDesc, coverPhoto } = req.body

        await sActDB.query().insert({
            name: name,
            zoomLink: zoomLink,
            day: day,
            stateLogo: stateLogo,
            quota: quota,
            registered: registered,
            attendanceCode: attendanceCode,
            identifier: identifier,
            category: category,
            shortDesc: shortDesc,
            coverPhoto: coverPhoto
        })
        
        return res.status(200).send({ message: 'STATE baru berhasil ditambahkan' })
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}


exports.updateState = async(req, res) => {
    const { stateID } = req.params

    try{
        const { name, zoomLink, day, stateLogo, quota, registered, attendanceCode, identifier, category, shortDesc, coverPhoto } = req.body
        const cekSTATE = await sActDB.query().where({ stateID: stateID })

        if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null){
            await sActDB.query().update({
                name: name,
                zoomLink: zoomLink,
                day: day,
                stateLogo: stateLogo,
                quota: quota,
                registered: registered,
                attendanceCode: attendanceCode,
                identifier: identifier,
                category: category,
                shortDesc: shortDesc,
                coverPhoto: coverPhoto
            }).where({ stateID: stateID })
            
            return res.status(200).send({ message: 'STATE berhasil diupdate' })
        }
        else
            return res.status(404).send({message: 'STATE ID ' + stateID + ' tidak ditemukan'})
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}

exports.deleteState = async(req, res) => {
    const { stateID } = req.params

    try{
        const cekSTATE = await sActDB.query().where({ stateID: stateID })

        if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null){
            await sActDB.query().delete().where({
                stateID: stateID
            })

            return res.status(200).send({ message: 'STATE berhasil dihapus' })
        }
        else
        return res.status(404).send({message: 'STATE ID ' + stateID + ' tidak ditemukan'})
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}