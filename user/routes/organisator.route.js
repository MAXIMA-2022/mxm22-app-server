const OrgController = require('../controllers/organisator.controller')
const validation = require('../validation/validate')
const middleware = require('../middleware/user.middleware')

module.exports = function(app){
    app.post(
        '/api/org/register',
        validation.organizatorRegisValidation, validation.runValidation,
        OrgController.register
    )
    app.post(
        '/api/org/login',
        validation.loginValidation, validation.runValidation,
        OrgController.login
    )

    app.get(
        '/api/org',
        middleware.verifyJWT, middleware.isPanitia,
        OrgController.readAllData
    )

    app.get(
        '/api/org/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        OrgController.readSpecificData
    )

    app.put(
        '/api/org/update/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        OrgController.updateData
    )

    app.delete(
        '/api/org/delete/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        OrgController.deleteData
    )
}