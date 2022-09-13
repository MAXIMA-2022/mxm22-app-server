const { check, validationResult } = require('express-validator')

// Register
exports.mhsRegisValidation = [
  check('nim').notEmpty().withMessage('Halo Maximers, NIM tidak boleh kosong, dicek lagi ya!'),
  check('name').notEmpty().withMessage('Halo Maximers, Nama tidak boleh kosong, dicek lagi ya!'),
  check('email').notEmpty().withMessage('Halo Maximers, Email tidak boleh kosong, dicek lagi ya!'),
  check('angkatan').notEmpty().withMessage('Halo Maximers, Tahun Angkatan tidak boleh kosong, dicek lagi ya!'),
  check('password').notEmpty().withMessage('Halo Maximers, Password tidak boleh kosong, dicek lagi ya!'),
  check('tempatLahir').notEmpty().withMessage('Halo Maximers, Tempat lahir tidak boleh kosong, dicek lagi ya!'),
  check('tanggalLahir').notEmpty().withMessage('Halo Maximers, Tanggal lahir tidak boleh kosong, dicek lagi ya!'),
  check('jenisKelamin').notEmpty().withMessage('Halo Maximers, Jenis kelamin tidak boleh kosong, dicek lagi ya!'),
  check('prodi').notEmpty().withMessage('Halo Maximers, Prodi tidak boleh kosong, dicek lagi ya!'),
  check('whatsapp').notEmpty().withMessage('Halo Maximers, Nomor Whatsapp tidak boleh kosong, dicek lagi ya!'),
  check('idLine').notEmpty().withMessage('Halo Maximers, ID Line tidak boleh kosong, dicek lagi ya!'),
  check('idInstagram').notEmpty().withMessage('Halo Maximers, Username Instagram tidak boleh kosong, dicek lagi ya!')
]

exports.panitiaRegisValidation = [
  check('nim').notEmpty().withMessage('Nim tidak boleh kosong'),
  check('name').notEmpty().withMessage('Nama tidak boleh kosong'),
  check('email').notEmpty().withMessage('Email tidak boleh kosong'),
  check('password').notEmpty().withMessage('Password tidak boleh kosong'),
  check('divisiID').notEmpty().withMessage('ID divisi tidak boleh kosong')
]

exports.organizatorRegisValidation = [
  check('nim').notEmpty().withMessage('Nim tidak boleh kosong'),
  check('name').notEmpty().withMessage('Nama tidak boleh kosong'),
  check('email').notEmpty().withMessage('Email tidak boleh kosong'),
  check('password').notEmpty().withMessage('Password tidak boleh kosong'),
  check('stateID').notEmpty().withMessage('ID State tidak boleh kosong')
]

// Login
exports.loginValidation = [
  check('nim').notEmpty().withMessage('Nim tidak boleh kosong'),
  check('password').notEmpty().withMessage('Password tidak boleh kosong')
]

exports.mhsLoginValidation = [
  check('nim').notEmpty().withMessage('Halo Maximers, NIM tidak boleh kosong, dicek lagi ya!'),
  check('password').notEmpty().withMessage('Halo Maximers, Password tidak boleh kosong, dicek lagi ya!')
]

// Update
exports.mhsUpdateValidation = [
  check('name').notEmpty().withMessage('Halo, Maximates! Nama tidak boleh kosong, dicek lagi ya!'),
  check('whatsapp').notEmpty().withMessage('Halo, Maximates! Nomor Whatsapp tidak boleh kosong, dicek lagi ya!'),
  check('email').notEmpty().withMessage('Halo, Maximates! Email tidak boleh kosong, dicek lagi ya!'),
  check('angkatan').notEmpty().withMessage('Halo, Maximates! Tahun Angkatan tidak boleh kosong, dicek lagi ya!'),
  check('idInstagram').notEmpty().withMessage('Halo, Maximates! ID Instagram tidak boleh kosong, dicek lagi ya!'),
  check('idLine').notEmpty().withMessage('Halo, Maximates! ID Line tidak boleh kosong, dicek lagi ya!'),
  check('tanggalLahir').notEmpty().withMessage('Halo, Maximates! Tanggal lahir tidak boleh kosong, dicek lagi ya!'),
  check('tempatLahir').notEmpty().withMessage('Halo, Maximates! Tempat lahir tidak boleh kosong, dicek lagi ya!'),
  check('jenisKelamin').notEmpty().withMessage('Halo, Maximates! Jenis kelamin tidak boleh kosong, dicek lagi ya!'),
  check('prodi').notEmpty().withMessage('Halo, Maximates! Prodi tidak boleh kosong, dicek lagi ya!')
]

exports.panitUpdateValidation = [
  check('name').notEmpty().withMessage('Halo, Maximates! Nama tidak boleh kosong, dicek lagi ya!'),
  check('email').notEmpty().withMessage('Halo, Maximates! Email tidak boleh kosong, dicek lagi ya!'),
  check('divisiID').notEmpty().withMessage('Halo, Maximates! ID Divisi tidak boleh kosong, dicek lagi ya!'),
]

exports.resetPassValidation = [
  check('token').notEmpty().withMessage('Halo, Maximers! Token tidak boleh kosong, dicek lagi ya!'),
  check('password').notEmpty().withMessage('Halo, Maximers! Password tidak boleh kosong, dicek lagi ya!'),
  check('confirmPassword').notEmpty().withMessage('Halo, Maximers! Confirm Password tidak boleh kosong, dicek lagi ya!'),
]

exports.sendTokenValidation = [
  check('nim').notEmpty().withMessage('Halo, Maximers! NIM tidak boleh kosong, dicek lagi ya!'),
]


exports.panitVerifiedValidation = [
  check('verified').notEmpty().withMessage('Verified tidak boleh kosong'),
]

exports.getTokenValidation = [
  check('nim').notEmpty().withMessage('Halo Maximers, NIM tidak boleh kosong, dicek lagi ya!')
]

exports.orgUpdateValidation = [
  check('nim').notEmpty().withMessage('Nim tidak boleh kosong'),
  check('name').notEmpty().withMessage('Nama tidak boleh kosong'),
  check('email').notEmpty().withMessage('Email tidak boleh kosong')
]

exports.ktmValidation = (req, res, next) => {
    const ktmErrors = []

    const acceptedType = ['image/png', 'image/jpg', 'image/jpeg']

    switch (true) {
      case !req.files :
        ktmErrors.push({
          key: 'ktm',
          message: 'Foto KTM tidak boleh kosong'
        })
        break
      case !req.files.ktm :
        ktmErrors.push({
          key: 'ktm',
          message: 'Foto KTM tidak boleh kosong'
        })
        break
      case (!acceptedType.includes(req.files.ktm.mimetype)) :
        ktmErrors.push({
          key: 'ktm',
          message: 'Harap menggunakan tipe file png, jpg, atau jpeg'
        })
        break
    }

    req.ktmErrors = ktmErrors
    next()
}

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req).errors
  const ktmErrors = req.ktmErrors

  const listErrors = []
  if (errors.length !== 0) {
    errors.map(error => {
      listErrors.push({
        key: error.param,
        message: error.msg
      })
    })
  }

  if(ktmErrors !== undefined && ktmErrors.length !== 0){
    listErrors.push(ktmErrors[0])
  }

  if (listErrors.length !== 0) { return res.status(400).send(listErrors) }
  next()
}