const { check, validationResult } = require('express-validator')

exports.regisMalpunValidation = (req, res, next) => {
    check('email').notEmpty().withMessage('Email tidak boleh kosong'),
    check('name').notEmpty().withMessage('Nama tidak boleh kosong'),
    check('attendanceCode2').notEmpty().withMessage('Token tidak boleh kosong')
}

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


    if (listErrors.length !== 0) 
        return res.status(400).send(listErrors)

    next()
}