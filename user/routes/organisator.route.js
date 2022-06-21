const OrgController = require('../controllers/organisator.controller')
const validation = require('../validation/validate')

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
}