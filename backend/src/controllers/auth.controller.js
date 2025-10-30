// backend/src/controllers/auth.controller.js

const User = require("../models/User");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// JWT Token oluşturma
const createToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};


exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ errors: [{ msg: 'Bu email zaten kayıtlı' }] });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ errors: [{ msg: 'Bu kullanıcı adı zaten kayıtlı' }] });
            }
        }

        const user = new User({
            username,
            email,
            password,
        });

        await user.save();
        const token = createToken(user._id);
        res.status(200).json({ token, username: user.username, id: user._id });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Sunucu Hatası');
    }
};


exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { loginField, password } = req.body;

    const { email } = req.body;
    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Geçersiz kimlik bilgileri' }] });
        }

        //Parola doğru mu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Geçersiz kimlik bilgileri' }] });
        }

        // JWT Token oluştur ve gönder
        const token = createToken(user._id);

        res.status(200).json({ token, username: user.username, id: user._id });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Sunucu Hatası');
    }
};

// Me: Token'a bağlı kullanıcının temel bilgilerini döndür
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username email');
        if (!user) {
            return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
        }
        return res.status(200).json({ id: req.user.id, username: user.username, email: user.email });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Sunucu Hatası');
    }
};