const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    // Bu, "Notları listele" dediğimizde sadece O kullanıcının notlarını getirmemizi sağlar.
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // 'User' modeline referans (User.js dosyasındaki model adı)
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Lütfen bir başlık girin'],
        trim: true,
        maxlength: [100, 'Başlık en fazla 100 karakter olabilir'],
    },
    content: {
        type: String,
        required: [true, 'İçerik boş olamaz'],
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('Note', NoteSchema);