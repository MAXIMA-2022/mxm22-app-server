const malpunController = require('../controllers/malpun.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require('../validation/validation')

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
        middleware.verifyJWT, middleware.isMahasiswa,
        validation.malpunMhsValidation, validation.runValidation,
        malpunController.regisMalpunMhs 
    ) 

    app.put(
        '/api/malpun/verifyMaba/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        malpunController.updateVerifyMaba
    )
}