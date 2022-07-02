const sActController = require('../controllers/state_activties.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require ('../validation/validate')

module.exports = function(app){
    app.get(
        '/api/state',
        middleware.verifyJWT, 
        sActController.readAllState
    )
    app.get(
        '/api/state/:stateID',
        middleware.verifyJWT,
        sActController.readSpecificState
    )

    app.post(
        '/api/state/createState',
        middleware.verifyJWT, middleware.isPanitia, 
        validation.createStateActValidation, validation.runValidation,
        sActController.createState
    )

    app.put(
        '/api/state/update/:stateID',
        middleware.verifyJWT, middleware.isPanitia,
        validation.updateStateActValidation, validation.runValidation,
        sActController.updateState
    )

    app.delete(
        '/api/state/delete/:stateID',
        middleware.verifyJWT, middleware.isPanitia,
        sActController.deleteState
    )
}