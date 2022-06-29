const MhsDB = require('../model/mahasiswa.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    const { 
        name, 
        nim, 
        password, 
        whatsapp, 
        email, 
        idInstagram, 
        idLine, 
        tanggalLahir, 
        tempatLahir, 
        jenisKelamin, 
        prodi 
    } = req.body

    const hashPass = await bcrypt.hashSync(password, 8)
    const cekNIM = await MhsDB.query().where({ nim: nim })

    try{
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null || cekNIM === undefined){
            await MhsDB.query().insert({
                name: name,
                nim: nim, 
                password: hashPass,
                whatsapp: whatsapp,
                email: email,
                idInstagram: idInstagram,
                idLine: idLine,
                tanggalLahir: tanggalLahir,
                tempatLahir: tempatLahir,
                jenisKelamin: jenisKelamin,
                prodi: prodi
            })

            return res.status(200).send({ message: 'Akun baru berhasil ditambahkan' })
        }
        else
            return res.status(409).send({ message: 'Akun anda sebelumnya telah terdaftar' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.login = async(req, res) => {
    const { nim, password } = req.body;
    const checkingNim = await MhsDB.query().where({ nim: nim })

    try{
        if(checkingNim.length === 0){
            return res.status(400).send({
                message : 'NIM atau password salah!'
            })
        }

        const isPassValid = bcrypt.compareSync(password, checkingNim[0].password)

        if(!isPassValid){
            return res.status(400).send({ message: 'NIM atau password salah!' })
        }

        const JWTtoken = jwt.sign({nim: checkingNim[0].nim}, process.env.SECRET_KEY, {
            expiresIn: 86400 //equals to 24H
        })

        return res.status(200).send({
            message: "Login berhasil",
            token: JWTtoken
        })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}


exports.readAllData = async(req, res) => {
    try {
        const result = await MhsDB.query()
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }

}
exports.readSpecificData = async(req, res) => {
    const { nim } = req.params

    try{
        const cekNIM = await MhsDB.query().where({ nim: nim })

        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            const result = await MhsDB.query().where({ 
                nim: nim
            })

            return res.status(200).send(result)
        }
        else
            return res.status(404).send({ message: 'NIM ' + nim + ' tidak ditemukan!'})
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}


exports.updateData = async(req, res) => {
    const { nim } = req.params
    const { 
        name, 
        whatsapp, 
        email, 
        idInstagram, 
        idLine, 
        tanggalLahir, 
        tempatLahir, 
        jenisKelamin, 
        prodi 
    } = req.body

    const authorizedDiv = ['D01', 'D02']
    const division = req.division

    try{
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await MhsDB.query().where({ nim: nim })

        if(cekNIM.length !== 0 && cekNIM !== [] && cekNIM !== null && cekNIM !== undefined){
            await MhsDB.query().update({
                name: name,
                whatsapp: whatsapp,
                email: email,
                idInstagram: idInstagram,
                idLine: idLine,
                tanggalLahir: tanggalLahir,
                tempatLahir: tempatLahir,
                jenisKelamin: jenisKelamin,
                prodi: prodi
            }).where({ nim: nim })

            return res.status(200).send({ message: 'Data berhasil diupdate' })
        }
        else
            return res.status(404).send({ message: 'NIM ' + nim + ' tidak ditemukan!' })
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}


exports.deleteData = async(req, res) => {
    const { nim } = req.params
    const authorizedDiv = ['D01', 'D02']
    const division = req.division

    try{
        if(!authorizedDiv.includes(division)){
            return res.status(403).send({
                message: "Divisi anda tidak punya otoritas yang cukup!"
            })
        }

        const cekNIM = await MhsDB.query().where({ nim: nim })
        
        if(cekNIM.length !== 0 || cekNIM !== [] || cekNIM !== null || cekNIM !== undefined){
            await MhsDB.query().delete().where({
                nim: nim
            })

            return res.status(200).send({ message: 'Data berhasil dihapus' })
        }
        else
            return res.status(404).send({ message: 'NIM ' + nim + ' tidak ditemukan!'})
    }
    catch (err) {
        return res.status(500).send({message: err.message})
    }
}
