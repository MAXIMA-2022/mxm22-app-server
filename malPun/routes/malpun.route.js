const malpunController = require('../controllers/malpun.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require('../validation/validation')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    app.get(
        '/api/malpun/',
        middleware.verifyJWT, middleware.isPanitia,
        malpunController.getAllData
    )

    app.get(
        '/api/malpunSpecific/',
        middleware.verifyJWT, middleware.isMahasiswa,
        malpunController.getSpecificData
    )

    app.post(
        '/api/malpun/regis',
        toggle.malpunMABA, toggle.checkToggle,
        middleware.verifyJWT, middleware.isMahasiswa,
        validation.malpunMhsValidation, validation.runValidation,
        malpunController.regisMalpunMhs 
    ) 

    app.put(
        '/api/malpun/verifyMaba/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        malpunController.updateVerifyMaba
    )

    app.post(
        '/api/malpun/resendEmail',
        middleware.verifyJWT, middleware.isPanitia,
        validation.resendEmail, validation.runValidation,
        malpunController.resendEmail
    )
}