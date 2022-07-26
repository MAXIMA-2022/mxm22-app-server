const sActController = require('../controllers/state_activties.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require ('../validation/validate')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    // Public Access (must login first)
    app.get(
        '/api/state/',
        middleware.verifyJWT, 
        sActController.readPublicState
    )

    //Restricted Access
    app.get(
        '/api/stateAct',
        middleware.verifyJWT, middleware.isPanitia,
        sActController.readAllState
    )
    app.get(
        '/api/stateAct/:name',
        middleware.verifyJWT, middleware.isPanitia,
        sActController.readSpecificState
    )

    app.post(
        '/api/stateAct/createState',
        toggle.createState, toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia,      
        validation.logoValidation, validation.coverValidation, 
        validation.createStateActValidation, validation.runValidation,
        sActController.createState
    )

    app.put(
        '/api/stateAct/update/:stateID',
        toggle.updateState, toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia,
        validation.coverUpdateValidation, validation.logoUpdateValidation, 
        validation.updateStateActValidation, validation.runValidation,
        sActController.updateState     
    )

    app.delete(
        '/api/stateAct/delete/:stateID',
        toggle.deleteState, toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia,
        sActController.deleteState
    )
}