const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class State_Registration extends Model { 
    static get tableName(){
        return 'state_registration'
    }
}

module.exports = State_Registration