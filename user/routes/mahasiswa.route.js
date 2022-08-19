const MhsController = require('../controllers/mahasiswa.controller')
const validation = require('../validation/validate')
const middleware = require('../middleware/user.middleware')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    app.post(
        '/api/mhs/register',
        toggle.signUpMahasiswa, toggle.checkToggle,
        validation.mhsRegisValidation, validation.runValidation,
        MhsController.register
    )
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
}