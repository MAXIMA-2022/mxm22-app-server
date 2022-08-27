const helper = require('../../helpers/helper')
const tokenDB = require('../model/reset_password.model')
const MhsDB = require('../model/mahasiswa.model')
const logging = require('../../loggings/controllers/loggings.controllers')
const address = require('address')

exports.generateToken = async (req, res) => {
    const { nim } = req.body
    const nim2 = nim.replace(/^0+/, '')
    const ip = address.ip()
    try {
        const cekData = await MhsDB.query().where({ nim: nim2 })

        if(cekData.length === 0 || cekData === []){
            return res.status(404).send({ 
                message: 'NIM ' + nim + ' tidak ditemukan!'
            })
        }

        const token = helper.createOTP()
        const date_time = helper.createAttendanceTime()
        await tokenDB.query().insert({
            nim: nim2,
            token,
            confirm: 0,
            requestDate: date_time
        })

        return res.status(200).send({ token })
    } 
    catch (err) {
        logging.generateTokenLog('Generate Token for Reset Pass', nim2, ip, err.message)
        return res.status(500).send({
            message: err.message
        })
    }

}