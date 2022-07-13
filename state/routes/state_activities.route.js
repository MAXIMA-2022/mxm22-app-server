const sActController = require('../controllers/state_activties.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require ('../validation/validate')

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
        '/api/stateAct/:stateID',
        middleware.verifyJWT, middleware.isPanitia,
        sActController.readSpecificState
    )


    app.post(
        '/api/stateAct/createState',
        middleware.verifyJWT, middleware.isPanitia,      
        validation.logoValidation, validation.coverValidation, 
        validation.createStateActValidation, validation.runValidation,
        sActController.createState
    )

    app.put(
        '/api/stateAct/update/:stateID',
        middleware.verifyJWT, middleware.isPanitia,
        validation.coverUpdateValidation, validation.logoUpdateValidation, 
        validation.updateStateActValidation, validation.runValidation,
        sActController.updateState     
    )

    app.delete(
        '/api/stateAct/delete/:stateID',
        middleware.verifyJWT, middleware.isPanitia,
        sActController.deleteState
    )
}