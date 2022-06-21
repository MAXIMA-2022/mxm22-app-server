const MhsController = require('../controllers/mahasiswa.controller')
const validation = require('../validation/validate')

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
}