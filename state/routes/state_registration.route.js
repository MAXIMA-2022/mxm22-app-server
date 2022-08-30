const sRegController = require('../controllers/state_registration.controller')
const middleware = require ('../../user/middleware/user.middleware')
const validation = require ('../validation/validate')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app) {
    app.get(
        '/api/stateReg',
        middleware.verifyJWT,
        sRegController.readAllRegistration
    )
    app.get(
        '/api/stateRegBySID/:stateID',
        middleware.verifyJWT, middleware.isPanitia,
        sRegController.readStateRegByStateID
    )

    app.get(
        '/api/stateReg2/:stateID',
        middleware.verifyJWT, middleware.isOrganisator,
        sRegController.readStateRegByStateID
    )

    app.get(
        '/api/stateReg/:nim',
        middleware.verifyJWT,
        sRegController.readSpecificRegistration
    )

    app.post(
        '/api/stateReg/createSRegis/:nim',
        toggle.stateRegistration, toggle.checkToggle,
        middleware.verifyJWT, middleware.isMahasiswa, 
        sRegController.createStateReg
    )

    app.put(
        '/api/stateReg/attendState/:stateID/:nim',
        toggle.presensi, toggle.checkToggle,
        middleware.verifyJWT, middleware.isMahasiswa,
        validation.attendState, validation.runValidation,
        sRegController.attendState
    )
    
    app.put(
        '/api/stateReg/verifyAttendance/:stateID/:nim',
        toggle.presensi, toggle.checkToggle,
        middleware.verifyJWT, middleware.isMahasiswa,
        validation.verifyAttendance, validation.runValidation,
        sRegController.verifyAttendance
    )

    app.delete(
        '/api/stateReg/deleteSRegis/:stateID/:nim',
        middleware.verifyJWT, middleware.isMahasiswa,
        sRegController.deleteRegistration
    )
}