const PanitController = require('../controllers/panitia.controller')
const validation = require('../validation/validate')
const middleware = require('../middleware/user.middleware')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    app.post(
        '/api/panit/register', 
        toggle.signUpPanitiaOrganizator, toggle.checkToggle,
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
        validation.panitUpdateValidation, validation.runValidation,
        PanitController.updateData
    )
    app.put(
        '/api/panit/updateVerified/:nim',
        middleware.verifyJWT, middleware.isPanitia, 
        PanitController.updateVerified
    )
    
    app.delete(
        '/api/panit/delete/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        PanitController.deleteData
    )
}