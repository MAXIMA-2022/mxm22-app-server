const dayMan = require('../controllers/day_management.controller')
const middleware = require('../../user/middleware/user.middleware')

module.exports = function (app){
    app.get(
        '/api/dayManagement/',
        middleware.verifyJWT, middleware.isPanitia,
        dayMan.readAllData
    )
}
