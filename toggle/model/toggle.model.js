const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class Technical_Toggle extends Model { 
    static get tableName(){
        return 'technical_toggle'
    }
}

module.exports = Technical_Toggle