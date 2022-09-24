const toggleDB = require('../model/toggle.model')

exports.signInMahasiswa = async (req, res, next) => {
    req.toggleID = 11
    next()
}

exports.signUpMahasiswa = async (req, res, next) => {
    req.toggleID = 1
    next()
}
  
exports.signUpPanitiaOrganizator = async (req, res, next) => {
    req.toggleID = 2
    next()
}
  
exports.createHome = async (req, res, next) => {
    req.toggleID = 3
    next()
}
  
exports.updateHome = async (req, res, next) => {
    req.toggleID = 4
    next()
}
  
exports.deleteHome = async (req, res, next) => {
    req.toggleID = 5
    next()
}
  
exports.createState = async (req, res, next) => {
    req.toggleID = 6
    next()
}

exports.updateState = async (req, res, next) => {
    req.toggleID = 7
    next()
}
  
exports.deleteState = async (req, res, next) => {
    req.toggleID = 8
    next()
}
  
exports.stateRegistration = async (req, res, next) => {
    req.toggleID = 9
    next()
}

exports.presensi = async (req, res, next) => {
    req.toggleID = 10
    next()
}

exports.malpunMABA = async(req, res, next) => {
    req.toggleID = 22
    next()
}

exports.malpunOUTSIDER = async(req, res, next) => {
    req.toggleID = 23
    next()
}

exports.checkToggle = async (req, res, next) => {
    try {
        const toggleID = req.toggleID

        const dbToggle = await toggleDB.query().where({ id: toggleID })
        if (dbToggle[0].toggle === 0) {
            return res.status(409).send({
                message: 'Mohon maaf permintaan kalian tidak dapat dilayani karena belum mencapai atau telah melewati waktu yang ditentukan'
            })
        }
        next()
    } 
    catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }
}