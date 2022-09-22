const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class Malpun extends Model { 
    static get tableName(){
        return 'malpun_attendance'
    }

    static get relationMappings(){ 
        const Mahasiswa = require('../../user/model/mahasiswa.model')
        return {
            Mahasiswa:{
                relation: Model.HasManyRelation,
                modelClass: Mahasiswa,
                join:{
                    from: 'malpun_attendance.nim',
                    to: 'mahasiswa.nim'
                }
            }
        }
    }
}

module.exports = Malpun;