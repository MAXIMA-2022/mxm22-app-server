const { check, validationResult } = require('express-validator')

exports.createStateActValidation = [
    check('name').notEmpty().withMessage('Nama STATE tidak boleh kosong'),
    check('zoomLink').notEmpty().withMessage('Link Zoom tidak boleh kosong'),
    check('day').notEmpty().withMessage('Hari STATE tidak boleh kosong'),    
    check('quota').notEmpty().withMessage('Jumlah kuota  STATE tidak boleh kosong'),
    check('category').notEmpty().withMessage('Kategori STATE tidak boleh kosong'),
    //sementara
    check('stateLogo').notEmpty().withMessage('Logo STATE tidak boleh kosong'), 
    check('coverPhoto').notEmpty().withMessage('Cover foto STATE tidak boleh kosong') 
]

exports.updateStateActValidation = [
    check('name').notEmpty().withMessage('Nama STATE tidak boleh kosong'),
    check('zoomLink').notEmpty().withMessage('Link Zoom tidak boleh kosong'),
    check('day').notEmpty().withMessage('Hari STATE tidak boleh kosong'),    
    check('quota').notEmpty().withMessage('Jumlah kuota  STATE tidak boleh kosong'),
    check('category').notEmpty().withMessage('Kategori STATE tidak boleh kosong'),
    //sementara
    check('stateLogo').notEmpty().withMessage('Logo STATE tidak boleh kosong'), 
    check('coverPhoto').notEmpty().withMessage('Cover foto STATE tidak boleh kosong') 
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