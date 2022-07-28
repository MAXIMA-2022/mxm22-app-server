const divisiController = require('../controllers/divisi.controller');

module.exports = function(app){
    app.get(
        '/api/divisi',
        divisiController.getDivisi
    )
}