const { Model } = require('objection');
const knex = require('../../config/knex')

Model.knex(knex)

class Mahasiswa extends Model{
    static get tableName(){
        return 'mahasiswa';
    }
}

module.exports = Mahasiswa;