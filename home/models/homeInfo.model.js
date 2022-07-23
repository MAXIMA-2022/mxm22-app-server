const { Model } = require('objection');
const knex = require('../../config/knex')

Model.knex(knex)

class Home_Information extends Model{
    static get tableName(){
        return 'home_information'
    }

    static get relationMappings(){ 
        const Chapter_dialogues = require('../../chapters/models/chaptersDial.models')
        return {
            chapter_dialogues:{
                relation: Model.HasManyRelation,
                modelClass: Chapter_dialogues,
                join:{
                    from: 'home_information.chapter',
                    to: 'chapter_dialogues.homeChapterID'
                }
            }
        }
    }
}

module.exports = Home_Information