const ToggleDB = require('../../toggle/model/toggle.model')
const d = new Date()

exports.openAbsenAwal = async (req, res, next) => {   
    if(d.getHours() >= 17 && d.getMinutes() >= 0){
        await ToggleDB.query().update({
            toggle: 1
        }).where({ name: "absenAwal" })
    }

    next()
}

exports.closeAbsenAwal = async(req, res, next) => {
    if(d.getHours() >= 17 && d.getMinutes() > 45){
        await ToggleDB.query().update({
            toggle: 0
        }).where({ name: "absenAwal" })
    }

    next()
}


exports.openAbsenAkhir = async (req, res, next) => {   
    if(d.getHours() >= 21 && d.getMinutes() >= 0){
        await ToggleDB.query().update({
            toggle: 1
        }).where({ name: "absenAkhir" })
    }

    next()
}

exports.closeAbsenAkhir = async(req, res, next) => {
    if(d.getHours() >= 21 && d.getMinutes() > 30){
        await ToggleDB.query().update({
            toggle: 0
        }).where({ name: "absenAkhir" })
    }

    next()
}