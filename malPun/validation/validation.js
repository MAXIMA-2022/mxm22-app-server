const { check, validationResult } = require('express-validator')

exports.regisMalpunValidation = [
    check('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
    check('email').notEmpty().withMessage('Email tidak boleh kosong'),
    check('no_hp').notEmpty().withMessage('Nomor Handphone tidak boleh kosong')
]

exports.malpunMhsValidation = [
  check('nim').notEmpty().withMessage('NIM tidak boleh kosong')
]

exports.proofValidation = (req, res, next) => {
  const proofErrors = []
  const acceptedType = ['image/png', 'image/jpg', 'image/jpeg']

  switch (true) {
    case !req.files :
      proofErrors.push({
        key: 'proof',
        message: 'Gambar Bukti tidak boleh kosong'
      })
      break
    case !req.files.proof :
      proofErrors.push({
        key: 'proof',
        message: 'Gambar Bukti tidak boleh kosong'
      })
      break
    case (!acceptedType.includes(req.files.proof.mimetype)) :
      proofErrors.push({
        key: 'proof',
        message: 'Harap menggunakan tipe file png, jpg, atau jpeg'
      })
      break
  }

  req.proofErrors = proofErrors

  next()
}

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req).errors
    const proofErrors = req.proofErrors
    const listErrors = []
    if (errors.length !== 0) {
      errors.map(error => {
        listErrors.push({
          key: error.param,
          message: error.msg
        })
      })
    }
  
    if (proofErrors !== undefined && proofErrors.length !== 0)
        listErrors.push(proofErrors[0])

    if (listErrors.length !== 0) { return res.status(400).send(listErrors) }
    next()
  }