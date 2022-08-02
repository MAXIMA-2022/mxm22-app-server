const { check, validationResult } = require('express-validator')

exports.createStateActValidation = [
    check('name').notEmpty().withMessage('Nama STATE tidak boleh kosong'),
    check('day').notEmpty().withMessage('Hari STATE tidak boleh kosong'),    
    check('quota').notEmpty().withMessage('Jumlah kuota  STATE tidak boleh kosong'),
    check('category').notEmpty().withMessage('Kategori STATE tidak boleh kosong'),

]

exports.updateStateActValidation = [
    check('name').notEmpty().withMessage('Nama STATE tidak boleh kosong'),
    check('day').notEmpty().withMessage('Hari STATE tidak boleh kosong'),    
    check('quota').notEmpty().withMessage('Jumlah kuota  STATE tidak boleh kosong'),
    check('category').notEmpty().withMessage('Kategori STATE tidak boleh kosong'),

]

exports.createStateRegisValidation = [
  check('nim').notEmpty().withMessage('NIM tidak boleh kosong'),
  check('queueNo').notEmpty().withMessage('Queue Number tidak boleh kosong'),
  check('attendanceCode').notEmpty().withMessage('Attendance Code tidak boleh kosong'),
  check('inEventAttendance').notEmpty().withMessage('In Event Attendance tidak boleh kosong'),
  check('exitAttendance').notEmpty().withMessage('Exit Event Attendance tidak boleh kosong')
]

exports.attendState = [
  check('attendanceCode').notEmpty().withMessage('Token tidak boleh kosong'),
]

exports.verifyAttendance = [
  check('attendanceCode2').notEmpty().withMessage('Token tidak boleh kosong'),
]


exports.logoValidation = (req, res, next) => {
  const logoErrors = []
  const acceptedType = ['image/png', 'image/jpg', 'image/jpeg']

  switch (true) {
    case !req.files :
      logoErrors.push({
        key: 'stateLogo',
        message: 'Gambar Logo tidak boleh kosong'
      })
      break
    case !req.files.stateLogo :
      logoErrors.push({
        key: 'stateLogo',
        message: 'Gambar Logo tidak boleh kosong'
      })
      break
    case (!acceptedType.includes(req.files.stateLogo.mimetype)) :
      logoErrors.push({
        key: 'stateLogo',
        message: 'Harap menggunakan tipe file png, jpg, atau jpeg'
      })
      break
  }

  req.logoErrors = logoErrors

  next()
}

exports.coverValidation = (req, res, next) => {
  const coverErrors = []
  const acceptedType = ['image/png', 'image/jpg', 'image/jpeg']

  switch (true) {
      case !req.files :
          coverErrors.push({
              key: 'coverPhoto',
              message: 'Foto Cover tidak boleh kosong'
          })
      break
      case !req.files.coverPhoto :
          coverErrors.push({
              key: 'coverPhoto',
              message: 'Gambar Logo tidak boleh kosong'
          })
      break
      case !acceptedType.includes(req.files.coverPhoto.mimetype) :
          coverErrors.push({
              key: 'coverPhoto',
              message: 'Harap menggunakan tipe file png, jpg, atau jpeg'
          })
      break
  }

  req.coverErrors = coverErrors
  next()
}


exports.logoUpdateValidation = (req, res, next) => {
    const logoErrors = []
    const acceptedType = ['image/png', 'image/jpg', 'image/jpeg']

    if (req.files && req.files.stateLogo) {
        if (!acceptedType.includes(req.files.stateLogo.mimetype)) {
            logoErrors.push({
                key: 'stateLogo',
                message: 'Harap menggunakan tipe file png, jpg, atau jpeg'
            })
        }
    }

    req.logoErrors = logoErrors
    next()
}

exports.coverUpdateValidation = (req, res, next) => {
    const coverErrors = []
    const acceptedType = ['image/png', 'image/jpg', 'image/jpeg']

    if (req.files && req.files.coverPhoto) {
        if (!acceptedType.includes(req.files.coverPhoto.mimetype)) {
            coverErrors.push({
                key: 'coverPhoto',
                message: 'Harap menggunakan tipe file png, jpg, atau jpeg'
            })
        }
    }

    req.coverErrors = coverErrors
    next()
}

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req).errors
    const logoErrors = req.logoErrors
    const coverErrors = req.coverErrors

    const listErrors = []

    if (errors.length !== 0) {
        errors.map(error => {
            listErrors.push({
                key: error.param,
                message: error.msg
            })
        })
    }

    if (logoErrors !== undefined && logoErrors.length !== 0)
        listErrors.push(logoErrors[0])

    if (coverErrors !== undefined && coverErrors.length !== 0)
        listErrors.push(coverErrors[0])

    if (listErrors.length !== 0) 
        return res.status(400).send(listErrors)

    next()
}