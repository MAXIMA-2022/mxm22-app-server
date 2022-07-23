const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class Day_Management extends Model { 
    static get tableName(){
        return 'day_management'
    }
}

module.exports = Day_Management