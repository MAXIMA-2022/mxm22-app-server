const sRegisDB = require('../model/state_registration.model')
const sActDB = require('../model/state_activities.model')
const MhsDB = require('../../user/model/mahasiswa.model')
const helper = require('../../helpers/helper')
const address = require('address')
const logging = require('../../loggings/controllers/loggings.controllers')

exports.readAllRegistration = async(req, res) => {
    try {
        let result = await sRegisDB.query()

        for(let i = 0; i < result.length; i++){
            const nMhs = await MhsDB.query().select('name').where({ nim: result[i].nim })
            const nState = await sActDB.query().select('name').where({ stateID: result[i].stateID })

            result[i].name = nMhs[0].name
            result[i].stateName = nState[0].name
        }
 
        return res.status(200).send(result)      
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.createStateReg = async(req, res) => {
    try{
        const { stateID } = req.body
        const { nim } = req.params
        const nim2 = req.decoded_nim
        const ip = address.ip()
        
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


        if(nim === null || nim === ':nim'){
            logging.registerStateLog('RegisterState', nim2, nim, ip, 'NIM anda kosong! Harap diisi terlebih dahulu')
            return res.status(404).send({
                message: 'NIM anda kosong! Harap diisi terlebih dahulu'
            })
        }

        if(nim2 != nim) {
            logging.registerStateLog('RegisterState', nim2, nim, ip, 'Kamu tidak dapat mendaftar STATE menggunakan akun lain!')
            return res.status(403).send({ 
                message: 'Kamu tidak dapat mendaftar STATE menggunakan akun lain!' 
            })
        }        

        const len = dbState.length
        if(len + 1 > 3){
            logging.registerStateLog('RegisterState', nim2, nim, ip, 'Kamu hanya dapat mendaftar pada maksimal 3 STATE saja!')
            return res.status(403).send({ 
                message: 'Kamu hanya dapat mendaftar pada maksimal 3 STATE saja!'
            })
        }
            

        if(cekSTATE.length === 0 || cekSTATE === []){
           logging.registerStateLog('RegisterState', nim2, nim, ip, 'STATE yang kamu input tidak terdaftar, dicek lagi ya!')
            return res.status(404).send({ 
                message: 'STATE yang kamu input tidak terdaftar, dicek lagi ya!' 
            }) 
        }
                 
        if(cekParticipant.length !== 0 && cekParticipant !== []){
            logging.registerStateLog('RegisterState', nim2, nim, ip, 'Kamu telah mendaftar pada STATE ini!')
            return res.status(403).send({ 
                message: 'Kamu telah mendaftar pada STATE ini!' 
            })
        }
   
        const data = await sActDB.query().where({ stateID })
        if(len > 0){
            const day = data[0].day
            const mhsDay2 = await sActDB.query()
            .select(
                'state_activities.*',
                'state_registration.*'
            )
            .join(
                'state_registration',
                'state_registration.stateID',
                'state_activities.stateID'
            )
            .where('state_registration.nim', nim)

            for(let i = 0; i < len; i++){
                if(day === mhsDay2[i].day){
                    logging.registerStateLog('RegisterState', nim2, nim, ip, 'Kamu tidak dapat mendaftar pada lebih dari 1 STATE pada hari yang sama!')
                    return res.status(400).send({ 
                        message: 'Kamu tidak dapat mendaftar pada lebih dari 1 STATE pada hari yang sama!' 
                    })
                }
            }
        }
        
        const qt1 = data[0].quota
        const qt2 = data[0].registered + 1
        if(qt2 > qt1){
            logging.registerStateLog('RegisterState', nim2, nim, ip, 'Mohon maaf MAXIMERS, quota untuk STATE ' + data[0].name + ' sudah penuh')
            return res.status(400).send({ 
                message: 'Mohon maaf MAXIMERS, quota untuk STATE ' + data[0].name + ' sudah penuh' 
            })
        }
            
        await sRegisDB.query().insert({
            stateID,
            nim,
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
        ).where('state_activities.stateID', stateID)

        await sActDB.query()
        .update({
            registered: dbActivities[0].registered + 1
        }).where('stateID', stateID)
        
        logging.registerStateLog('RegisterState', nim2, nim, ip, 'No Error Found')
        return res.status(200).send({ message: 'Registrasi STATE berhasil dilakukan' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    } 
}


exports.deleteRegistration = async(req, res) => {
    const { stateID, nim } = req.params
    const nim2 = req.decoded_nim
    const ip = address.ip()

    try{           
        if(nim === null || nim === ':nim'){
            logging.cancelStateLog('CancelState', nim2, nim, ip, 'NIM anda kosong! Harap diisi terlebih dahulu')
            return res.status(404).send({
                message: 'NIM anda kosong! Harap diisi terlebih dahulu'
            })
        }

        if(stateID === null || stateID === ':stateID'){
            logging.cancelStateLog('CancelState', nim2, nim, ip, 'STATE ID kosong! Harap diisi terlebih dahulu')
            return res.status(404).send({
                message: 'STATE ID kosong! Harap diisi terlebih dahulu'
            })
        } 

        if(nim2 != nim) {
            logging.cancelStateLog('CancelState', nim2, nim, ip, 'Kamu tidak dapat menghapus Registered STATE milik akun lain!')
            return res.status(403).send({ 
                message: 'Kamu tidak dapat menghapus Registered STATE milik akun lain!' 
            })
        }

        const cekSTATE = await sActDB.query().where({ stateID })
        if(cekSTATE.length === 0 || cekSTATE === []){
            logging.cancelStateLog('CancelState', nim2, nim, ip, 'STATE yang kamu input tidak terdaftar, dicek lagi ya!')
            return res.status(404).send({ 
                message: 'STATE yang kamu input tidak terdaftar, dicek lagi ya!' 
            }) 
        }

        const cekRegister = await sRegisDB.query().where({ nim, stateID }) 
        if(cekRegister.length === 0 || cekRegister === []){
            logging.cancelStateLog('CancelState', nim2, nim, ip, 'Kamu belum mendaftar pada STATE ini!' )
            return res.status(403).send({ 
                message: 'Kamu belum mendaftar pada STATE ini!' 
            })
        }
            
        await sRegisDB.query().delete().where({ nim, stateID })
        const dbActivities = await sActDB.query().where({ stateID })
        
        await sActDB.query()
        .where('stateID', stateID)
        .patch({
            registered: dbActivities[0].registered - 1
        })
        
        logging.cancelStateLog('CancelState', nim2, nim, ip, 'No Error Found')
        return res.status(200).send({ message: 'Registrasi STATE berhasil dihapus' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.attendState = async(req, res) => {
    try {
        const { nim, stateID } = req.params
        const { attendanceCode } = req.body
        const attendanceTime = helper.createAttendanceTime()
        const nim2 = req.decoded_nim
        const ip = address.ip()

        if(nim === null || nim === ':nim'){
            logging.attendStateLog('AttendState', nim2, nim, ip, 'NIM anda kosong! Harap diisi terlebih dahulu')
            return res.status(404).send({
                message: 'NIM anda kosong! Harap diisi terlebih dahulu'
            })
        }

        if(stateID === null || stateID === ':stateID'){
            logging.attendStateLog('AttendState', nim2, nim, ip, 'STATE ID kosong! Harap diisi terlebih dahulu')
            return res.status(404).send({
                message: 'STATE ID kosong! Harap diisi terlebih dahulu'
            })
        } 

        
        if(nim2 != nim){
            logging.attendStateLog('AttendState', nim2, nim, ip, 'Kamu tidak dapat melakukan absensi STATE milik orang lain')
            return res.status(403).send({ 
                message: 'Kamu tidak dapat melakukan absensi STATE milik orang lain' 
            })
        }
        
        const cekAttendanceCode = await sActDB.query().where({ stateID, attendanceCode })
        if(cekAttendanceCode.length === 0 || cekAttendanceCode === []){
            logging.attendStateLog('AttendState', nim2, nim, ip, 'Token yang kamu masukkan salah!')
            return res.status(404).send({ 
                message: 'Token yang kamu masukkan salah!'
            })
        }

        const cekRegister = await sRegisDB.query().where({ nim, stateID })
        if(cekRegister.length === 0 || cekRegister === []){
            logging.attendStateLog('AttendState', nim2, nim, ip, 'Kamu belum mendaftar pada STATE ini!')
            return res.status(404).send({ 
                message: 'Kamu belum mendaftar pada STATE ini!' 
            })
        }

        await sRegisDB.query()
        .patch({ attendanceTime, inEventAttendance: 1 })
        .where({ nim, stateID })
        
        logging.attendStateLog('AttendState', nim2, nim, ip, 'No Error Found')
        return res.status(200).send({ message: 'Proses absensi selesai' })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.verifyAttendance = async(req, res) => {
    try {
        const { nim, stateID } = req.params
        const { attendanceCode2 } = req.body
        const tokenTime = helper.createAttendanceTime()
        const nim2 = req.decoded_nim
        const ip = address.ip()

        if(nim === null || nim === ':nim'){
            logging.verifyAttendanceLog('VerifyAttendance', nim2, nim, ip, 'NIM anda kosong! Harap diisi terlebih dahulu')
            return res.status(404).send({
                message: 'NIM anda kosong! Harap diisi terlebih dahulu'
            })
        }

        if(stateID === null || stateID === ':stateID'){
            logging.verifyAttendanceLog('VerifyAttendance', nim2, nim, ip, 'STATE ID kosong! Harap diisi terlebih dahulu')
            return res.status(404).send({
                message: 'STATE ID kosong! Harap diisi terlebih dahulu'
            })
        } 

        if(nim2 != nim){
            logging.verifyAttendanceLog('VerifyAttendance', nim2, nim, ip, 'Kamu tidak bisa melakukan absensi STATE milik orang lain')
            return res.status(403).send({ 
                message: 'Kamu tidak bisa melakukan absensi STATE milik orang lain' 
            })
        }

        const cekAttendanceCode = await sActDB.query().where({ stateID, attendanceCode2 })
        if(cekAttendanceCode.length === 0 || cekAttendanceCode === []){
            logging.verifyAttendanceLog('VerifyAttendance', nim2, nim, ip, 'Token yang kamu masukkan salah!')
            return res.status(404).send({ 
                message: 'Token yang kamu masukkan salah!'
            })
        }

        const cekRegister = await sRegisDB.query().where({ nim, stateID }) 
        if(cekRegister.length === 0 || cekRegister === []){
            logging.verifyAttendanceLog('VerifyAttendance', nim2, nim, ip, 'Kamu belum mendaftar pada STATE ini!')
            return res.status(404).send({ 
                message: 'Kamu belum mendaftar pada STATE ini!' 
            })
        }

        const cekAttendance = await sRegisDB.query().select('attendanceTime', 'inEventAttendance').where({ nim, stateID }) 
        if(cekAttendance[0].inEventAttendance === 0 || cekAttendance[0].attendanceTime === 0){
            logging.verifyAttendanceLog('VerifyAttendance', nim2, nim, ip, 'Kamu belum melakukan absensi yang pertama!')
            return res.status(404).send({
                message: 'Kamu belum melakukan absensi yang pertama!'
            })
        }
           
        await sRegisDB.query()
        .patch({ exitAttendance: 1, tokenTime: tokenTime })
        .where({ nim, stateID })
        
        logging.verifyAttendanceLog('VerifyAttendance', nim2, nim, ip, 'No Error Found')
        return res.status(200).send({ message: 'Proses absensi selesai' })
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}