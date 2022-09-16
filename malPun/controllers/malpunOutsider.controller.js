const MalpunOutDB = require('../models/malpunOutsider.model')
const MhsDB = require('../../user/model/mahasiswa.model')
const logging = require('../../loggings/controllers/loggings.controllers')
const nodemailer = require('nodemailer')
const address = require('address')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAILER_EMAIL,  
        pass: process.env.MAILER_PASS,
    }
})

exports.getAllDataOuts = async(req, res) => {
    try {
        const result = await MalpunOutDB.query()
        return res.status(200).send(result)
    } 
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


exports.regisMalpunOuts = async(req, res) => {
    const { 
        name,
        email
    } = req.body
    
    const ip = address.ip()

    const cekData = await MalpunOutDB.query().where({ email }) 
    if(cekData.length !== 0 && cekData !== []){
        return res.status(409).send({ 
            message: 'Halo Maximers, akun anda sebelumnya telah terdaftar'
        })
    }
            
     try { 
        await MalpunOutDB.query().insert({
            name,
            email
        }) 
    
        const option = {
            from: "Maxima 2022 <noreply@gmail.com>",
            to: `${email}`,
            subject: "Bukti Registrasi Malam Puncak",
            text: "Hai Maximers,\n\nSelamat kamu berhasil mendaftar acara Malam Puncak Maxima 2022."
        }

        transporter.sendMail(option, (err, info) => {
            if(err) console.error(err)
            console.log(`Email terkirim : ${option.to}`)
        })
        
        return res.status(200).send({ message: 'Registrasi Malam Puncak Berhasil' })
    } 
    catch (err) {
        logging.registerMalpunOutsiderLog('Register/Malpun/Outsider', name, ip ,err.message)
        return res.status(500).send({ message: 'Halo Maximers, maaf ada kesalahan dari internal' })
    }
}


exports.updateVerifyOuts = async(req, res) => {
    const { id } = req.params

    try{
        if(id === null || id === ':id'){
            return res.status(404).send({
                message: 'ID kosong! Harap diisi terlebih dahulu'
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

        const cekID = await MalpunOutDB.query().where({ id })
        if(cekID.length === 0 || cekID === []){
            return res.status(404).send({ 
                message: 'ID ' + id + ' tidak ditemukan!'
            })
        }

        if(verified < 0 || verified > 1){
            return res.status(406).send({ 
                message: 'Value hanya boleh angka 0 atau 1 saja!' 
            })
        }

        await MalpunOutDB.query().update({
            verified
        }).where({ id })

        return res.status(200).send({ message: 'Data berhasil diupdate' })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}