const { Model } = require('objection');
const knex = require('../../config/knex')

Model.knex(knex)

class Panitia extends Model{
    static get tableName(){
        return 'panitia';
    }

    static get relationMappings(){ 
        const Divisi = require('./divisi.model')
        return {
            divisi:{
                relation: Model.HasManyRelation,
                modelClass: Divisi,
                join:{
                    from: 'panitia.divisiID',
                    to: 'divisi.divisiID'
                }
            }
        }
    }
}

module.exports = Panitia;