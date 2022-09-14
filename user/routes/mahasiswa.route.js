const MhsController = require('../controllers/mahasiswa.controller')
const validation = require('../validation/validate')
const middleware = require('../middleware/user.middleware')
const toggle = require('../../toggle/middleware/toggle.middleware')
const tokenController = require('../controllers/reset_password.controller')

module.exports = function(app){
    app.post(
        '/api/mhs/register',
        toggle.signUpMahasiswa, toggle.checkToggle,
        validation.mhsRegisValidation, validation.runValidation,
        MhsController.register
    )

    // app.post(
    //     '/api/mhsMnp/register',
    //     toggle.signUpMahasiswa, toggle.checkToggle,
    //     validation.mhsRegisValidation, validation.ktmValidation, validation.runValidation,
    //     MhsController.registerMhsMNP
    // )

    app.post(
        '/api/mhs/login',
        toggle.signInMahasiswa, toggle.checkToggle,
        validation.mhsLoginValidation, validation.runValidation,
        MhsController.login
    )

    app.get(
        '/api/mhs',
        middleware.verifyJWT, middleware.isPanitia,
        MhsController.readAllData
    )
    app.get(
        '/api/mhs/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        MhsController.readSpecificData
    )

    app.get(
        '/api/mhsMnp/',
        middleware.verifyJWT, middleware.isPanitia,
        MhsController.readAllMnpData
    )
    app.get(
        '/api/mhsMnp/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        MhsController.readSpecificMnpData
    )

    app.put(
        '/api/mhs/update/:nim',
        middleware.verifyJWT, middleware.isPanitia, 
        validation.mhsUpdateValidation, validation.runValidation,
        MhsController.updateData
    )

    app.delete(
        '/api/mhs/delete/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        MhsController.deleteData
    )

    //buat yang pake email service
    app.post(
        '/api/mhs/sendEmail',
        validation.sendTokenValidation, validation.runValidation,
        MhsController.sendToken
    )
    
    app.put(
        '/api/mhs/resetPass',
        validation.resetPassValidation, validation.runValidation,
        MhsController.resetingPass
    )

    //buat yang ga pake email service
    app.post(
        '/api/getToken/',
        validation.getTokenValidation, validation.runValidation,
        tokenController.generateToken
    )

    app.put(
        '/api/mhs/resetPass2',
        validation.resetPassValidation, validation.runValidation,
        MhsController.resetingPass2
    )
}