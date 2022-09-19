const MalpunDB = require('../models/malpun.model')
const MhsDB = require('../../user/model/mahasiswa.model')
const logging = require('../../loggings/controllers/loggings.controllers')
const address = require('address')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAILER_EMAIL,  
        pass: process.env.MAILER_PASS,
    }
})

const hbsOption = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve(__dirname, "mailTemplate"),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, "mailTemplate"),
      extName: ".handlebars",
}

transporter.use('compile', hbs(hbsOption))


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
        const nim = req.decoded_nim

        const cekRegNo = await MalpunDB.query().where({ nim })
        if(cekRegNo.length === 0 || cekRegNo === []){
            return res.status(200).send({
                 message: 'Anda belum mendaftar Malam Puncak' 
            })
        }

        return res.status(200).send(cekRegNo)  
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.regisMalpunMhs = async(req, res) =>{
    const { nim } = req.body
    const nim2 = req.decoded_nim
    const newNim = nim.replace(/^0+/, '')
    const ip = address.ip()
    
    const cekNIM = await MhsDB.query().where({ nim })
    if(cekNIM.length === 0 || cekNIM === []){
        return res.status(404).send({ 
            message: 'NIM ' + nim + ' tidak terdaftar!' 
        }) 
    }

    if(nim2 != newNim){
        return res.status(403).send({ 
            message: 'Kamu tidak bisa melakukan pendaftaran Malam Puncak dengan akun orang lain' 
        })
    }

    try { 
        const cekData = await MalpunDB.query().where({ nim })
        if(cekData.length !== 0 && cekData !== []){
            return res.status(409).send({ 
                message: 'Halo Maximers, akun anda sebelumnya telah terdaftar'
            })
        }

        const data = await MhsDB.query().where({ nim })
        

        const option = {
            from: "Maxima 2022 <noreply@gmail.com>",
            to: `${data[0].email}`,
            subject: "[You\’ve got your Ticket, Maximers]",
            text: "Hai Maximers,\n\nSelamat kamu berhasil mendaftar acara Malam Puncak Maxima.",
            template: 'index'
        }

        transporter.sendMail(option, (err, info) => {
            if(err) console.error(err)
            console.log(`Email terkirim : ${option.to}`)
        })

        await MalpunDB.query().insert({
            nim: newNim
        }) 

        return res.status(200).send({ message: 'Registrasi Malam Puncak Berhasil' })
    } 
    catch (err) {
        logging.registerMalpunMabaLog('Register/Malpun/Maba', nim ,ip ,err.message)
        return res.status(500).send({ message: 'Halo Maximers, maaf ada kesalahan dari internal' })
    }
}

exports.updateVerifyMaba = async(req, res) => {
    const { nim } = req.params
    
    try{
        if(nim === null || nim === ':nim'){
            return res.status(404).send({
                message: 'NIM kosong! Harap diisi terlebih dahulu'
            })
        }

        const { verified } = req.body
        const authorizedDiv = ['D01', 'D02', 'D13', 'D14']
        const division = req.division

        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await MalpunDB.query().where({ nim })
        if(cekNIM.length === 0 || cekNIM === []){
            return res.status(404).send({ 
                message: 'nim ' + nim + ' tidak ditemukan!'
            })
        }

        if(verified < 0 || verified > 1){
            return res.status(406).send({ 
                message: 'Value hanya boleh angka 0 atau 1 saja!' 
            })
        }

        await MalpunDB.query().update({
            verified
        }).where({ nim })
        return res.status(200).send({ message: 'Data berhasil diupdate' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}