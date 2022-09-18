const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class MalpunOutsider extends Model { 
    static get tableName(){
        return 'malpun_outsider'
    }
}

module.exports = MalpunOutsider;