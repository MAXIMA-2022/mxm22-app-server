const sActController = require('../controllers/state_activties.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require ('../validation/validate')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    // Public Access (Anonymous/public (but not logged in) access)
    app.get(
        '/api/state_activities/',
        sActController.readState
    )

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
        '/api/stateAct/:stateID',
        middleware.verifyJWT, middleware.isPanitia,
        sActController.readSpecificState
    )

    //Resticted Access (Panit Acc Only)
    app.get(
        '/api/stateActivities/:day',
        middleware.verifyJWT, middleware.isPanitia,
        sActController.readStateByDay
    )

    app.post(
        '/api/stateAct/createState',
        toggle.createState, toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia,      
        validation.logoValidation, validation.createStateActValidation, 
        validation.runValidation,
        sActController.createState
    )

    app.put(
        '/api/stateAct/update/:stateID',
        toggle.updateState, toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia, validation.logoUpdateValidation,
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