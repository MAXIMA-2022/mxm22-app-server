const HMediaController = require('../controllers/homeMedia.controllers')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require('../validation/validate')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    app.get(
        '/api/homeMedia',
        HMediaController.readAllHMedia
    )
    app.get(
        '/api/homeMedia/photoID/:photoID',
        HMediaController.specificByPhotoID
    )

    app.get(
        '/api/homeMedia/homeID/:homeID',
        middleware.verifyJWT, middleware.isPanitia,
        HMediaController.specificByHomeID
    )

    app.post(
        '/api/home/createHomeMedia',
        toggle.createHome, toggle.checkToggle,
        validation.createHMediaValidation, validation.insertMediaValidation,
        validation.runValidation,
        middleware.verifyJWT, middleware.isPanitia,
        HMediaController.createNewHMedia
    )

    app.delete(
        '/api/home/deleteHomeMedia/:photoID',
        toggle.deleteHome ,toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia,
        HMediaController.deleteHMedia
    )
}