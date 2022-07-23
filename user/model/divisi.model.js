const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class Divisi extends Model { 
    static get tableName(){
        return 'divisi'
    }
}

module.exports = Divisi 