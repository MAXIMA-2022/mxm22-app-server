const { check, validationResult } = require('express-validator')

exports.regisMalpunValidation = [
    check('email').notEmpty().withMessage('Email tidak boleh kosong'),
    check('name').notEmpty().withMessage('Nama tidak boleh kosong'),
    check('phoneNumber').notEmpty().withMessage('Nomor Handphone tidak boleh kosong')
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