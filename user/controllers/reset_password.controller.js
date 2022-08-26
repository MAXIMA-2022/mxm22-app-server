const helper = require('../../helpers/helper')
const tokenDB = require('../model/reset_password.model')

exports.generateToken = async (req, res) => {
    try {
        const token = helper.createOTP()
        const date_time = helper.createAttendanceTime()
        await tokenDB.query().insert({
            token,
            confirm: 0,
            requestDate: date_time
        })

        return res.status(200).send({ token })
    } 
    catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }

}