const { Model } = require('objection')
const knex = require('../../config/knex') 

Model.knex(knex)

class State_Activities extends Model { 
    static get tableName(){
        return 'state_activities'
    }

    static get relationMappings(){ 
        const Day_Management = require('./day_management.model')
        return {
            day_management:{
                relation: Model.HasManyRelation,
                modelClass: Day_Management,
                join:{
                    from: 'state_activites.day',
                    to: 'day_management.day'
                }
            }
        }
    }
}

module.exports = State_Activities