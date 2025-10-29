const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require('./config/db');

// veritabanını bağlıyoruz
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // JSON verilerini işlemek için

// === YENİ ROUTE TANIMLAMASI ===
const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
app.use('/api/auth', authRoutes); // /api/auth/register ve /api/auth/login burada çalışacak
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('Backend Sunucusu Çalışıyor!');
});


// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`✅ Backend sunucusu http://localhost:${PORT} portunda çalışıyor`);
});
