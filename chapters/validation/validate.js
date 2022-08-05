const { check, validationResult } = require('express-validator')

exports.insertChapterValidation = [
    check('homeChapterID').notEmpty().withMessage('ID Chapter Dialogues tidak boleh kosong'),
    check('name').notEmpty().withMessage('Nama Chapter Dialogues tidak boleh kosong')
]

exports.updateChapterValidation = [
    check('name').notEmpty().withMessage('Nama Chapter Dialogues tidak boleh kosong')
]


exports.runValidation = (req, res, next) => {
    const errors = validationResult(req).errors
    const listErrors = []
    
    if (errors.length !== 0) {
        errors.map(error => {
            listErrors.push({
                key: error.param,
                message: error.msg
            })
        })
    }
  
    if (listErrors.length !== 0) { return res.status(400).send(listErrors) }
    next()
}