const PanitController = require('../controllers/panitia.controller')
const validation = require('../validation/validate')
const middleware = require('../middleware/user.middleware')

module.exports = function(app){
    app.post(
        '/api/panit/register',
        validation.panitiaRegisValidation, validation.runValidation,
        PanitController.register
    )
    app.post(
        '/api/panit/login',
        validation.loginValidation, validation.runValidation,
        PanitController.login
    )

    app.get(
        '/api/panit',
        middleware.verifyJWT, middleware.isPanitia,
        PanitController.readAllData
    )
    app.get(
        '/api/panit/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        PanitController.readSpecificData
    )

    app.put(
        '/api/panit/update/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        PanitController.updateData
    )
    
    app.delete(
        '/api/panit/delete/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        PanitController.deleteData
    )
}