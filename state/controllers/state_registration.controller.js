const sRegisDB = require('../model/state_registration.model')
const sActDB = require('../model/state_activities.model')
const helper = require('../../helpers/helper')

exports.readAllRegistration = async(req, res) => {
    try {
        const result = await sRegisDB.query()

        return res.status(200).send(result)      
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

// exports.readSpecificState = async(req, res) => {
//     const { stateID } = req.params
//     const cekSTATE = await sRegisDB.query().where({ stateID })
    
//     if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null && cekSTATE !== undefined){
//         const result = await sRegisDB.query().where({ stateID })

//         return res.status(200).send(result)
//     }
//     else
//         return res.status(404).send({ message: 'STATE ID ' + stateID + ' tidak ditemukan' })
// }

exports.createStateReg = async(req, res) => {
    try{
        const { stateID } = req.body
        const { nim } = req.params
        
        const dbState = await sActDB.query()
        .select(
            'state_activities.*',
            'day_management.date',
            'state_registration.attendanceTime',
            'state_registration.inEventAttendance',
            'state_registration.exitAttendance'
        )
        .join(
            'state_registration',
            'state_registration.stateID',
            'state_activities.stateID'
        )
        .join(
            'day_management',
            'day_management.day',
            'state_activities.day'
        )
        .where('state_registration.nim', nim)
        .orderBy('day_management.day')

        const cekSTATE = await sActDB.query().where({ stateID })
        const cekParticipant = await sRegisDB.query().where({ nim, stateID })
        const len = dbState.length
        let cek = 0

        if(cekParticipant.length === 0 || cekParticipant === [] || cekParticipant === null || cekParticipant === undefined)
            cek = 1
        else 
            return res.status(403).send({ message: 'Kamu telah mendaftar pada STATE ini!' })

        if(cekSTATE.length !== 0 && cekSTATE !== [] && cekSTATE !== null && cekSTATE !== undefined){
            if(len < 3 && cek == 1){
                await sRegisDB.query().insert({
                    stateID,
                    nim,
                    queueNo: 0,
                    attendanceTime: 0,
                    inEventAttendance: 0,
                    exitAttendance: 0,
                    tokenTime: 0
                })

                const dbActivities = await sActDB.query()
                .select(
                    'state_activities.*',
                    'day_management.date',
                    'state_registration.exitAttendance'
                )
                .join(
                    'state_registration',
                    'state_registration.stateID',
                    'state_activities.stateID'
                )
                .join(
                    'day_management',
                    'day_management.day',
                    'state_activities.day'
                )
                .where('state_activities.stateID', stateID)
        
                await sActDB.query()
                .where('stateID', stateID)
                .update({
                    registered: dbActivities[0].registered + 1
                })
                
                return res.status(200).send({ message: 'Registrasi STATE berhasil dilakukan' })
            }
            else
                return res.status(403).send({ message: 'Kamu hanya dapat mendaftar pada maksimal 3 STATE saja!'})
        }
        else 
            return res.status(409).send({ message: 'STATE yang kamu input belum/ tidak terdaftar, dicek lagi ya!' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    } 
}


exports.deleteRegistration = async(req, res) => {
    const { stateID, nim } = req.params
    const nim2 = req.decoded_nim

    try{
        const cekRegister = await sRegisDB.query().where({ nim, stateID }) 
        
        if(cekRegister.length !== 0 && cekRegister !== [] && cekRegister !== null && cekRegister !== undefined){
            if(nim2 == nim) {
                await sRegisDB.query().delete().where({ nim, stateID })
                const dbActivities = await sActDB.query().where({ stateID })
                
                await sActDB.query()
                .where('stateID', stateID)
                .patch({
                    registered: dbActivities[0].registered - 1
                })
                
                return res.status(200).send({ message: 'Registrasi STATE berhasil dihapus' })
            }
            else{
                return res.status(403).send({ message: 'Kamu tidak dapat menghapus Registered STATE milik akun lain!' })
            }    
        }
        else
            return res.status(403).send({ message: 'Kamu belum mendaftar pada STATE ini!' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.verifyAttendance = async(req, res) => {
    const { nim, stateID } = req.params
    const { attendanceCode2 } = req.body
    const tokenTime = helper.createAttendanceTime()

    try {
        const cekRegister = await sRegisDB.query().where({ nim, stateID }) 

        if(cekRegister.length !== 0 && cekRegister !== [] && cekRegister !== null && cekRegister !== undefined){
            const cekAttendanceCode = await sActDB.query().where({ stateID, attendanceCode2 })

            if(cekAttendanceCode.length !== 0 && cekAttendanceCode !== [] && cekAttendanceCode !== null && cekAttendanceCode !== undefined){
                await sRegisDB.query()
                .patch({ exitAttendance: 1, tokenTime: tokenTime })
                .where({ nim, stateID })
                
                return res.status(200).send({ message: 'Proses absensi selesai' })
            }
            else
                return res.status(404).send({ message: 'Token yang kamu masukkan salah!' })
        }
        else
            return res.status(404).send({ message: 'Kamu belum mendaftar pada STATE ini!' })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}