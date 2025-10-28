const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const noteController = require('../controllers/note.controller');

/**
 * @route   POST /api/notes
 * @desc    Yeni not oluştur (KORUMALI)
 * @access  Private (Token gereklidir)
 */

router.post(
    '/',
    authMiddleware, // !!! SADECE TOKEN VARSA İŞLEM DEVAM EDER !!!
    [
        check('title', 'Başlık gereklidir').notEmpty(),
        check('content', 'İçerik boş olamaz').notEmpty(),
    ],
    noteController.createNote
);

/**
 * @route   GET /api/notes
 * @desc    Tüm notları listele (KORUMALI)
 * @access  Private (Token gereklidir)
 */
router.get(
    '/',
    authMiddleware, // Token kontrolü
    noteController.getAllNotes // Controller fonksiyonu
);

/**
 * @route   GET /api/notes/:id
 * @desc    Tek bir notu ID ile getir (KORUMALI)
 * @access  Private
 */
router.get(
    '/:id',
    authMiddleware,
    noteController.getNote
);


/**
 * @route   PUT /api/notes/:id
 * @desc    Notu ID ile güncelle (KORUMALI)
 * @access  Private
 */
router.put(
    '/:id',
    authMiddleware,
    noteController.updateNote
);


/**
 * @route   DELETE /api/notes/:id
 * @desc    Notu ID ile sil (KORUMALI)
 * @access  Private
 */
router.delete(
    '/:id',
    authMiddleware,
    noteController.deleteNote
);

module.exports = router;