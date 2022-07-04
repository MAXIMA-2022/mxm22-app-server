const sRegController = require('../controllers/state_registration.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require ('../validation/validate')

module.exports = function(app) {
    app.get(
        '/api/stateReg',
        middleware.verifyJWT, middleware.isPanitia,
        sRegController.readAllRegistration
    )
    /* app.get(
        '/api/stateReg/:stateID',
        middleware.verifyJWT,
        sRegController.readSpecificState
    ) */

    app.post(
        '/api/stateReg/createSRegis/:nim',
        middleware.verifyJWT, middleware.isMahasiswa, 
        sRegController.createStateReg
    )

    app.put(
        '/api/stateReg/verifyAttendance/:stateID/:nim',
        middleware.verifyJWT, middleware.isMahasiswa,
        validation.verifyAttendance2, validation.runValidation,
        sRegController.verifyAttendance
    )

    app.delete(
        '/api/stateReg/deleteSRegis/:stateID/:nim',
        middleware.verifyJWT, middleware.isMahasiswa,
        sRegController.deleteRegistration
    )
}