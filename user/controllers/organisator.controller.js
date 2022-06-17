const OrgDB = require('../model/organisator.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    const { nim, name, email, password, stateID } = req.body
    const hashPass = await bcrypt.hashSync(password, 8)
    const verified2 = 0

    try{
        await OrgDB.query().insert({
            name: name,
            nim: nim,
            email: email,
            password: hashPass,
            stateID: stateID,
            verified: verified2
        })

        return res.status(200).send({ message: 'User berhasil ditambahkan' })
    }
    catch(err){
        return res.status(500).send({ message: err.message })
    }
}

exports.login = async(req, res)=>{
    const { nim, password } = req.body;
    const checkingNim = await OrgDB.query().where({ nim: nim })

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