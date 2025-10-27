const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Lütfen bir email adresi girin"],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Lütfen geçerli bir email adresi girin',
        ]
    },
    password: {
        type: String,
        required: [true, "Lütfen bir parole girin"],
        minlength: [6, "Parola en az 6 karakter olmalıdır"],
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Lütfen bir kullanıcı adı girin"],
        minlength: [4, "Kulanıcı adı en az 4 karakter olmalıdır"],
    },
})

// PAROLA HASH'LEME: Kullanıcıyı veritabanına kaydetmeden (pre-save) önce
// parolayı otomatik olarak hash'liyoruz.

UserSchema.pre("save", async function (next) {
    // Eğer parola değiştirilmediyse (örn: email güncelleniyorsa) tekrar hash'leme
    if(!this.isModified("password")){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch(error){
        next(error)
    }
});

UserSchema.methods.comparePassword = async function (userPassw) {
    return await bcrypt.compare(userPassw, this.password)
}

module.exports = mongoose.model("User", UserSchema)