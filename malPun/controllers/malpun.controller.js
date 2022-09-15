const MalpunDB = require('../models/malpun.model')
const MhsDB = require('../../user/model/mahasiswa.model')
const logging = require('../../loggings/controllers/loggings.controllers')
const nodemailer = require('nodemailer')
const { Storage } = require('@google-cloud/storage');
const helper = require('../../helpers/helper')
const storage = new Storage({ keyFilename:
    'keys/mxm22-bucket.json' })
    
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const address = require('address')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAILER_EMAIL,  
        pass: process.env.MAILER_PASS,
    }
})

exports.getAllData = async(req, res) => {
    try {
        const result = await MalpunDB.query()
        return res.status(200).send(result)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.getSpecificData = async(req, res) => {
    try {
        const { id } = req.params
        const cekRegNo = await MalpunDB.query().where({ id })

        if(cekRegNo.length === 0 || cekRegNo === []){
            return res.status(200).send({
                 message: 'Data dengan ID ' + id + ' tidak ditemukan!' 
            })
        }

        return res.status(200).send(cekRegNo)        
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


// exports.regisMalpun = async(req, res) => {
//     const { 
//         nama,
//         nim, 
//         angkatan,
//         email,
//         no_hp,
//     } = req.body

//     let nim2 = -1
//     if(nim === null || nim === ':nim')
//         nim2 = null
//     else
//         nim2 = nim.replace(/^0+/, '')   

//     const cekData = await MalpunDB.query().where({ email }) 
//     if(cekData.length !== 0 && cekData !== []){
//         return res.status(409).send({ 
//             message: 'Halo Maximers, akun anda sebelumnya telah terdaftar'
//         })
//     }
            
//      try { 
//         const { proof } = req.files

//         const fixName = helper.toTitleCase(nama).trim()
//         const uuidProof = uuidv4()
//         const proofs = fixName.trim().split(' ').join('-')
//         const extnameProof = path.extname(proof.name)
//         const basenameProof = path.basename(proof.name, extnameProof).trim().split(' ').join('-')

//         const fileNameProof = ${proofs}_${uuidProof}_${basenameProof}${extnameProof}
//         const uploadPathProof = 'proofMalpun/' + fileNameProof
//         const bucketName = 'mxm22-bucket-test'
//         const urlFileProof = https://storage.googleapis.com/${bucketName}/${fileNameProof}


//         await MalpunDB.query().insert({
//             nama,
//             nim,
//             angkatan,
//             email,
//             no_hp,
//             proof: urlFileProof
//         }) 

//         proof.mv(uploadPathProof, async (err) => {
//             if (err)
//                 return res.status(500).send({ message: err.messsage })
                            
//             await storage.bucket(bucketName).upload(uploadPathProof)
//             fs.unlink(uploadPathProof, (err) => {
//                 if (err) {
//                     return res.status(500).send({ message: err.messsage })
//                 }        
//             })
//         })
    
//         const option = {
//             from: "Maxima 2022 <noreply@gmail.com>",
//             to: `${email}`,
//             subject: "Bukti Registrasi Malam Puncak",
//             text: Hai Maximers,\n\nSelamat kamu berhasil mendaftar acara Malam Puncak Maxima 2022.
//         }

//         transporter.sendMail(option, (err, info) => {
//             if(err) console.error(err)
//             console.log(`Email terkirim : ${option.to}`)
//         })
        
//         return res.status(200).send({ message: 'Registrasi Malam Puncak Berhasil' })
//     } 
//     catch (err) {
//         logging.registerMalpunLog('Register/Malpun', nama, nim ,err.message)
//         return res.status(500).send({ message: 'Halo Maximers, maaf ada kesalahan dari internal' })
//     }
// }


exports.regisMalpunMhs = async(req, res) =>{
    const { nim } = req.body
    const nim2 = req.decoded_nim
    const ip = address.ip()
    
    const cekNIM = await MhsDB.query().where({ nim })
    if(cekNIM.length === 0 || cekNIM === []){
        return res.status(404).send({ 
            message: 'NIM ' + nim + ' tidak terdaftar!' 
        }) 
    }

    if(nim2 != nim){
        return res.status(403).send({ 
            message: 'Kamu tidak bisa melakukan pendaftaran Malam Puncak dengan akunorang lain' 
        })
    }

    const data = await MhsDB.query().where({ nim })
    nama = data[0].name
    email = data[0].email
    angkatan = data[0].angkatan
    no_hp = data[0].whatsapp

    try { 
        const cekData = await MalpunDB.query().where({ nim })
        if(cekData.length !== 0 && cekData !== []){
            return res.status(409).send({ 
                message: 'Halo Maximers, akun anda sebelumnya telah terdaftar'
            })
        }
        
        await MalpunDB.query().insert({
            nama,
            nim,
            angkatan,
            email,
            no_hp
        }) 

        const option = {
            from: "Maxima 2022 <noreply@gmail.com>",
            to: `${email}`,
            subject: "Bukti Registrasi Malam Puncak",
            text: "Hai Maximers,\n\nSelamat kamu berhasil mendaftar acara Malam Puncak Maxima."
        }

        transporter.sendMail(option, (err, info) => {
            if(err) console.error(err)
            console.log(`Email terkirim : ${option.to}`)
        })

        return res.status(200).send({ message: 'Registrasi Malam Puncak Berhasil' })
    } 
    catch (err) {
        logging.registerMalpunLog('Register/Malpun', nama, nim ,ip ,err.message)
        return res.status(500).send({ message: 'Halo Maximers, maaf ada kesalahan dari internal' })
    }
}