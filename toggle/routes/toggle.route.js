const toggle = require('../controllers/toggle.controller')
const middleware = require('../../user/middleware/user.middleware')

module.exports = function(app){
    app.get(
        '/api/toggle/',
        toggle.readAllToggle
    )

    app.put(
        '/api/toggle/updateToggle/:id',
        middleware.verifyJWT, middleware.isPanitia,
        toggle.updateToggleValue
    )
}