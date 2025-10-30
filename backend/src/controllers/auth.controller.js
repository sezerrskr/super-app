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

exports.editUser = async (req, res) => {
    try {
        // 1) Mevcut mu kontrolü (kendi id'n hariç)
        const { username, email } = req.body;
        if (username) {
            const exists = await User.findOne({ username, _id: { $ne: req.user.id } });
            if (exists) {
                return res.status(400).json({ errors: [{ msg: 'Bu kullanıcı adı zaten kayıtlı' }] });
            }
        }

        // 2) Güncelle
        const updated = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $set: { username, email } },
            { new: true, runValidators: true }
        );
        return res.json(updated);

    } catch (err) {
        if (err && err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || 'alan';
            return res.status(400).json({ errors: [{ msg: `Bu ${field} zaten kayıtlı` }] });
        }
        console.error(err);
        return res.status(500).json({ msg: 'Sunucu hatası' });
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

    // Me: Kullanıcı adı ve e-posta güncelle (şifre hariç)
    exports.editMe = async (req, res) => {
        try {
            // Sadece izin verilen alanları al (allowlist)
            const updates = {};
            if (typeof req.body.username === 'string') {
                updates.username = req.body.username.trim().toLowerCase();
            }
            if (typeof req.body.email === 'string') {
                updates.email = req.body.email.trim().toLowerCase();
            }

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ errors: [{ msg: 'Güncellenecek alan bulunamadı' }] });
            }

            // Benzersizlik kontrolü (kendi id’n hariç)
            if (updates.username) {
                const existsU = await User.findOne({ username: updates.username, _id: { $ne: req.user.id } }).select('_id').lean();
                if (existsU) {
                    return res.status(409).json({ errors: [{ msg: 'Bu kullanıcı adı zaten kayıtlı' }] });
                }
            }
            if (updates.email) {
                const existsE = await User.findOne({ email: updates.email, _id: { $ne: req.user.id } }).select('_id').lean();
                if (existsE) {
                    return res.status(409).json({ errors: [{ msg: 'Bu e‑posta zaten kayıtlı' }] });
                }
            }

            const updated = await User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: updates },
                { new: true, runValidators: true, upsert: false, projection: { username: 1, email: 1 } }
            );

            if (!updated) {
                return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
            }
            return res.json(updated);
        } catch (err) {
            if (err && err.code === 11000) {
                const field = Object.keys(err.keyPattern || {})[0] || 'alan';
                return res.status(409).json({ errors: [{ msg: `Bu ${field} zaten kayıtlı` }] });
            }
            console.error(err.message);
            return res.status(500).json({ msg: 'Sunucu hatası' });
        }
    };