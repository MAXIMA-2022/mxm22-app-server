const malpunOutsController = require('../controllers/malpunOutsider.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require('../validation/validation')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    app.get(
        '/api/malpunOuts/',
        middleware.verifyJWT, middleware.isPanitia,
        malpunOutsController.getAllDataOuts
    )

    app.post(
        '/api/malpunOuts/regis',
        toggle.malpunOUTSIDER, toggle.checkToggle,
        validation.regisMalpunOutsValidation, validation.runValidation,
        malpunOutsController.regisMalpunOuts
    )

    app.put(
        '/api/malpunOuts/verifyOuts/:id',
        middleware.verifyJWT, middleware.isPanitia,
        malpunOutsController.updateVerifyOuts
    )
}