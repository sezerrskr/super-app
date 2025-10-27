const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log(`✅ MongoDB'ye başarıyla bağlanıldı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Bağlantı Hatası: ${error.message}`);
    // Bağlantı kurulamadığı için uygulamayı durdurun
    process.exit(1); 
  }
};

module.exports = connectDB;