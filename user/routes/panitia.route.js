const PanitController = require('../controllers/panitia.controller')

module.exports = function(app){
    app.post(
        '/api/panit/register',
        PanitController.register
    )
    app.post(
        '/api/panit/login',
        PanitController.login
    )
}