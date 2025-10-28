const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Token'ı request header'ından al
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Yetkilendirme başarısız: Token bulunamadı veya formatı yanlış.' });
    }

    // 'Bearer TOKEN_DEGERI' yapısından token'ı ayır
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Token decode edildiyse, bu kullanıcının ID'si
        req.user = {
            id: decoded.id
        };

        //İşlemi bir sonraki adıma (Controller'a) geçir
        next();

    } catch (error) {
        // Token geçersizse (süresi dolmuşsa, imzası yanlışsa vb.)
        return res.status(401).json({ msg: 'Yetkilendirme başarısız: Geçersiz Token.' });
    }
};

module.exports = authMiddleware;