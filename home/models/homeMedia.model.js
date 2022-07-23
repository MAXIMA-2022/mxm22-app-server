const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class Home_Media extends Model { 
    static get tableName(){
        return 'home_media'
    }

    static get relationMappings(){ 
        const HomeInformation = require('./homeInfo.model')
        return {
            home_information:{
                relation: Model.HasManyRelation,
                modelClass: HomeInformation,
                join:{
                    from: 'home_media.homeID',
                    to: 'home_information.homeID'
                }
            }
        }
    }
}

module.exports = Home_Media