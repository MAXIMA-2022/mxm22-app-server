const PanitController = require('../controllers/panitia.controller')
const validation = require('../validation/validate')

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
}