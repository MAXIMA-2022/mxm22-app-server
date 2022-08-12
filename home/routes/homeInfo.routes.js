const HInfoController = require('../controllers/homeInfo.controllers')
const middleware = require ('../../user/middleware/user.middleware')
const validHInfo = require('../validation/validate')
const toggle = require('../../toggle/middleware/toggle.middleware')

module.exports = function(app){
    app.get(
        '/api/homeInfo',
        HInfoController.readAllHInfo
    )
    app.get(
        '/api/homeInfo/chapter/:chapterName',
        HInfoController.specificHomeByChapter
    )
    app.get(
        '/api/homeInfo/searchKey/:search_key',
        HInfoController.specificHomeBySearchKey
    )
    app.get(
        '/api/homeInfo/homeID/:homeID',
        middleware.verifyJWT, middleware.isPanitia,
        HInfoController.specificHomeByID
    )


    app.post(
        '/api/home/createHomeInfo',
        toggle.createHome, toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia, 
        validHInfo.createHInfoValidation, validHInfo.insertLogoValidation,
        validHInfo.linkValidation, validHInfo.runValidation,
        HInfoController.createHInfo
    )

    app.put(
        '/api/home/updateHomeInfo/:homeID',
        toggle.updateHome ,toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia, 
        validHInfo.updateHInfoValidation, validHInfo.updateLogoValidation,
        validHInfo.runValidation,
        HInfoController.updateHInfo
    ) 

    app.delete(
        '/api/home/deleteHomeInfo/:homeID',
        toggle.deleteHome ,toggle.checkToggle,
        middleware.verifyJWT, middleware.isPanitia, 
        HInfoController.deleteHInfo
    )
}