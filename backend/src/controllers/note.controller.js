const Note = require("../models/Note");
const { validationResult } = require('express-validator');

// --- CREATE (Oluşturma) İşlemi ---
exports.createNote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, content } = req.body;
    const ownerId = req.user.id;

    try {
        const newNote = new Note({
            title,
            content,
            owner: ownerId
        });

        const note = await newNote.save();

        res.status(201).json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Sunucu Hatası: Not oluşturulamadı.');
    }
}

// --- READ (okuma) İşlemi ---
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ owner: req.user.id }).sort({ createdAt: -1 }); // En yeniden en eskiye sırala
        res.status(200).json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Sunucu Hatası: Notlar getirilemedi.');
    }
}

// --- READ WİTH PARAMS (okuma) İşlemi ---
exports.getNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({ msg: 'Not bulunamadı.' });
        }

        if (note.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Yetkilendirme başarısız: Bu nota erişim izniniz yok.' });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error(error.message);
        // ID formatı hatalıysa bu hatayı verir
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Geçersiz not ID formatı.' });
        }
        res.status(500).send('Sunucu Hatası: Not getirilemedi.');
    }
}

// --- UPDATE (güncelleme) İşlemi ---
exports.updateNote = async (req, res) => {
    const { title, content } = req.body;

    const noteFields = {};
    if (title) noteFields.title = title;
    if (content) noteFields.content = content;

    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Not bulunamadı.' });
        }

        if (note.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Yetkilendirme başarısız: Bu notu güncelleme izniniz yok.' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: noteFields },
            { new: true } // Güncel halini döndür
        );
        return res.json(updatedNote);

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Geçersiz not ID formatı.' });
        }
        res.status(500).send('Sunucu Hatası: Not güncellenemedi.');
    }
};
// --- DELETE (silme) ---
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Not bulunamadı.' });
        }

        if (note.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Yetkilendirme başarısız: Bu notu silme izniniz yok.' });
        }

        // Notu sil
        await Note.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Not başarıyla silindi.' });

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Geçersiz not ID formatı.' });
        }
        res.status(500).send('Sunucu Hatası: Not silinemedi.');
    }
};