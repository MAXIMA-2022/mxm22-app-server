const DayManDB = require('../model/day_management.model')

exports.readAllData = async(req, res)=>{
    try{
        let result = await DayManDB.query()

        for(let i = 0; i < result.length; i++){
            let date = new Date(result[0].date).toUTCString()
            result[i].date = date
        }

        return res.status(200).send(result)

    }catch(err){
        return res.status(500).send({message: err.message})
    }
}