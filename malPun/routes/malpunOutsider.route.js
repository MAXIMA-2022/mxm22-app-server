const malpunOutsController = require('../controllers/malpunOutsider.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require('../validation/validation')

module.exports = function(app){
    app.get(
        '/api/malpunOuts/',
        middleware.verifyJWT, middleware.isPanitia,
        malpunOutsController.getAllDataOuts
    )

    app.post(
        '/api/malpunOuts/regis',
        validation.regisMalpunOutsValidation, validation.runValidation,
        malpunOutsController.regisMalpunOuts
    )

    app.put(
        '/api/malpunOuts/verifyOuts/:id',
        middleware.verifyJWT, middleware.isPanitia,
        malpunOutsController.updateVerifyOuts
    )
}