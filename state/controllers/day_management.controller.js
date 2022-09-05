const DayManDB = require('../model/day_management.model')

exports.readAllData = async(req, res)=>{
    try{
        let result = await DayManDB.query()

        for(let i = 0; i < result.length; i++){
            let date = new Date(result[i].date).toUTCString()
            let date2 = new Date(result[i].date)
            let time = date2.toLocaleTimeString('en-GB',  {
                hour: '2-digit',
                minute: '2-digit',
            })

            result[i].date = `${date.split(' ').slice(0, 4).join(' ')}  ${time} WIB`
        }

        return res.status(200).send(result)

    }catch(err){
        return res.status(500).send({message: err.message})
    }
}