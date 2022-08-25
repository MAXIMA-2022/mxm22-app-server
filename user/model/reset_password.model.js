const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class Reset_Password extends Model { 
    static get tableName(){
        return 'reset_password'
    }
}

module.exports = Reset_Password 