const malpunController = require('../controllers/malpun.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require('../validation/validation')

module.exports = function(app){
    app.get(
        '/api/panit/malpun/',
        middleware.verifyJWT, middleware.isPanitia,
        malpunController.getAllData
    )

    app.get(
        '/api/panit/malpun/:regNo',
        middleware.verifyJWT, middleware.isPanitia,
        malpunController.getSpecificData
    )

    app.post(
        '/api/malpun/regis',
        validation.regisMalpunValidation, validation.runValidation,
        malpunController.regisMalpun
    )
}