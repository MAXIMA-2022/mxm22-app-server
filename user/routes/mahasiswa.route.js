const MhsController = require('../controllers/mahasiswa.controller')
const validation = require('../validation/validate')
const middleware = require('../middleware/user.middleware')

module.exports = function(app){
    app.post(
        '/api/mhs/register',
        validation.mhsRegisValidation, validation.runValidation,
        MhsController.register
    )
    app.post(
        '/api/mhs/login',
        validation.loginValidation, validation.runValidation,
        MhsController.login
    )

    app.get(
        '/api/mhs',
        MhsController.readAllData
    )
    app.get(
        '/api/mhs/:nim',
        middleware.verifyJWT, middleware.isMahasiswa,
        MhsController.readSpecificData
    )

    app.put(
        '/api/mhs/update/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        MhsController.updateData
    )

    app.delete(
        '/api/mhs/delete/:nim',
        middleware.verifyJWT, middleware.isPanitia,
        MhsController.deleteData
    )
}