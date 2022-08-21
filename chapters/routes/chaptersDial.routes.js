const controller = require('../controllers/chaptersDial.controllers')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require('../validation/validate')

module.exports = function(app){
    app.get(
        '/api/chapter',
        controller.readAllChapter
    )

    app.get(
        '/api/chapter/:name',
        controller.readSpecificChapter
    )

    app.post(
        '/api/chapter/createChapter',
        middleware.verifyJWT, middleware.isPanitia,
        validation.insertChapterValidation, validation.runValidation,
        controller.createChapter
    )

    app.put(
        '/api/chapter/updateChapter/:homeChapterID',
        middleware.verifyJWT, middleware.isPanitia,
        validation.updateChapterValidation, validation.runValidation,
        controller.updateChapter
    )

    app.delete(
        '/api/chapter/deleteChapter/:homeChapterID',
        middleware.verifyJWT, middleware.isPanitia,
        controller.deleteChapter
    )
}