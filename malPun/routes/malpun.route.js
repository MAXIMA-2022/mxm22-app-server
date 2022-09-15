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
        '/api/malpun/:id',
        malpunController.getSpecificData
    )

    app.get(
        '/api/public/malpun/',
        middleware.verifyJWT,
        malpunController.getSpecificDataPublic
    )

    // app.post(
    //     '/api/malpun/regis',
    //     validation.regisMalpunValidation, validation.proofValidation, validation.runValidation,
    //     malpunController.regisMalpun
    // )

    app.post(
        '/api/malpun/mhs/regis',
        middleware.verifyJWT, middleware.isMahasiswa,
        validation.malpunMhsValidation, validation.runValidation,
        malpunController.regisMalpunMhs 
    ) 
}