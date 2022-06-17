const OrgController = require('../controllers/organisator.controller')

module.exports = function(app){
    app.post(
        '/api/org/register',
        OrgController.register
    )
    app.post(
        '/api/org/login',
        OrgController.login
    )
}