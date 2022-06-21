const PanitDB = require('../model/panitia.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    const { name, nim, password, email, divisiID, verified } = req.body
    const hashPass = await bcrypt.hashSync(password, 8)
    const cekNIM = await PanitDB.query().where({ nim: nim })
    const verified2 = 0
    

    try{
        if(cekNIM.length === 0 || cekNIM === [] || cekNIM === null){
            if (divisiID === 'D01')
                return res.status(401).send({ message: 'Anda tidak dapat mendaftar pada divisi tersebut' })
            
            await PanitDB.query().insert({
                name: name,
                nim: nim,
                password: hashPass,
                email: email,
                divisiID: divisiID, 
                verified: verified2
            })

            return res.status(200).send({ message: 'Akun baru berhasil ditambahkan'  })
        }
        else
            return res.status(409).send({ message: 'Akun anda sebelumnya telah terdaftar' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}

exports.login = async(req, res)=>{
    const { nim, password } = req.body;
    const checkingNim = await PanitDB.query().where({ nim: nim })

    try{
        if(checkingNim.length === 0){
            return res.status(400).send({
                message : 'NIM atau password salah!'
            })
        }

        const isPassValid = bcrypt.compareSync(password, checkingNim[0].password)

        if(!isPassValid){
            return res.status(400).send({
                message: 'NIM atau password salah!'
            })
        }

        const JWTtoken = jwt.sign({ nim: checkingNim[0].nim }, process.env.SECRET_KEY, {
            expiresIn: 86400 //equals to 24H
        })

        return res.status(200).send({
            message: "Berhasil login",
            //token: JWTtoken
        })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }

}