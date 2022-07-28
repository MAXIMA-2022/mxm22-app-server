const DivisiDB = require('../model/divisi.model')

exports.getDivisi = async (req, res) => {
    try {
        const result = await DivisiDB.query().whereNot({ divisiID: 'D01' })
        return res.status(200).send(result)
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}