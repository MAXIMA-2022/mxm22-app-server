const { Model } = require('objection');
const knex = require('../../config/knex')

Model.knex(knex)

class Organisator extends Model{
    static get tableName(){
        return 'organisator';
    }
}

module.exports = Organisator;