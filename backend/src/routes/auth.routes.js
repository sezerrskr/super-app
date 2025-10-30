const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middleware/auth.middleware');

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
/**
 * @route   GET /api/auth/me
 * @desc    Aktif kullanıcının bilgileri (korumalı)
 * @access  Private
 */
router.get('/me', authMiddleware, authController.getMe);

/**
 * @route   PUT /api/auth/me
 * @desc    Aktif kullanıcının kullanıcı adı/e-posta güncelle (şifre hariç)
 * @access  Private
 */
router.put(
  '/me',
  authMiddleware,
  [
    // Opsiyonel ama varsa doğrula
    check('email').optional().isEmail().withMessage('Geçerli bir e-posta girin'),
    check('username')
      .optional()
      .isLength({ min: 6, max: 32 }).withMessage('Kullanıcı adı 6-32 karakter olmalıdır')
      .matches(/^[a-zA-Z0-9_\.\-]+$/).withMessage('Sadece harf, rakam ve _.- kullanılabilir')
  ],
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return authController.editMe(req, res, next);
  }
);

router.put('/:id', authMiddleware, authController.editUser);