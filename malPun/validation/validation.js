const { check, validationResult } = require('express-validator')

exports.regisMalpunValidation = [
    check('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
    check('email').notEmpty().withMessage('Email tidak boleh kosong'),
    check('no_hp').notEmpty().withMessage('Nomor Handphone tidak boleh kosong'),
    check('proof').notEmpty().withMessage('Bukti tidak boleh kosong')
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