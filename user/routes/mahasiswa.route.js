const MhsController = require('../controllers/mahasiswa.controller')

module.exports = function(app){
    app.post(
        '/api/mhs/register',
        MhsController.register
    )
    app.post(
        '/api/mhs/login',
        MhsController.login
    )
}