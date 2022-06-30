const jwt = require('jsonwebtoken')
const PanitDB = require('../model/panitia.model')
const MhsDB = require('../model/mahasiswa.model')
const OrgDB = require('../model/organisator.model')

//check user is logged in or not
exports.verifyJWT = async(req, res, next)=>{
    const token = req.headers['x-access-token']
    if(!token){
        return res.status(403).send({ message: "Harap login terlebih dahulu!" })
    }

    await jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
        if(err){
            return res.status(401).send({ message: "Unauthorized!" })
        }

        req.decoded_nim = decoded.nim
        next()
    })
    
}

exports.isPanitia = async(req, res, next)=>{
    try{
        const nim = req.decoded_nim
        const data = await PanitDB.query().where({ nim })

        if(data.length === 0){
            return res.status(200).send({ message: "Anda tidak punya hak untuk akses ke halaman ini!" })
        }

        req.division = data[0].divisiID 
        next()
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}

exports.isMahasiswa = async(req, res, next)=>{
    try{
        const nim = req.decoded_nim
        const data = await MhsDB.query().where({ nim })

        if(data.length === 0){
            return res.status(200).send({ message: "Anda tidak punya hak untuk akses ke halaman ini!" })
        }

        next()
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}

exports.isOrganisator = async(req, res, next)=>{
    try{
        const nim = req.decoded_nim
        const data = await OrgDB.query().where({ nim })

        if(data.length === 0){
            return res.status(200).send({ message: "Anda tidak punya hak untuk akses ke halaman ini!" })
        }

        next()
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}