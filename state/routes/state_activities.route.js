const sActController = require('../controllers/state_activties.controller')
const authJWTMiddleware = require ('../../user/middleware/user.middleware')
const validation = require ('../validation/validate')

module.exports = function(app){
    app.post(
        '/api/state/createState',
        authJWTMiddleware.verifyJWT, validation.createStateActValidation, validation.runValidation,
        sActController.createState
    )

    app.get(
        '/api/state',
        authJWTMiddleware.verifyJWT,
        sActController.readAllState
    )
    app.get(
        '/api/state/:stateID',
        authJWTMiddleware.verifyJWT,
        sActController.readSpecificState
    )

    app.put(
        '/api/state/update/:stateID',
        authJWTMiddleware.verifyJWT, validation.updateStateActValidation, validation.runValidation,
        sActController.updateState
    )

    app.delete(
        '/api/state/delete/:stateID',
        authJWTMiddleware.verifyJWT,
        sActController.deleteState
    )
}