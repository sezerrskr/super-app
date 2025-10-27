const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @route   POST /api/auth/register
 * @desc    Yeni kullanıcı kaydı
 * @access  Public
 */

router.post(
    '/register',
    [
        // Gelen veriyi doğrulama
        check('email', 'Lütfen geçerli bir email girin').isEmail(),
        check('password', 'Parola en az 6 karakter olmalıdır').isLength({ min: 6 }),
    ],
    authController.registerUser
);

router.post(
  '/login',
  [
    check('email', 'Lütfen geçerli bir email girin').isEmail(),
    check('password', 'Parola gereklidir').exists(),
  ],
  authController.loginUser
);

module.exports = router;