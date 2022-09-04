const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class Malpun extends Model { 
    static get tableName(){
        return 'malpun_attendance'
    }
}

module.exports = Malpun;