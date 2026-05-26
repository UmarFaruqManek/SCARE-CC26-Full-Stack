require("dotenv").config(); // Muat variabel dari file .env sebelum apapun

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sequelize = require("./config/database");
const Prediction = require("./models/Prediction");
const { classifyScar } = require("./services/predictService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware wajib
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sinkronisasi Database
sequelize.sync({ force: false })
  .then(() => console.log("Database SQLite berhasil disinkronisasi."))
  .catch((err) => console.error("Gagal sinkronisasi database:", err));

// Konfigurasi Multer untuk upload file gambar (In-Memory Buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar (JPG, JPEG, PNG) yang diperbolehkan!"), false);
    }
  },
});

// ==========================================
// ENDPOINT RESTful API
// ==========================================

// 1. POST /api/predict - Klasifikasi AI & simpan metadata ke database
app.post("/api/predict", upload.single("image"), async (req, res, next) => {
  try {
    // Proteksi: validasi input file
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Silakan unggah gambar luka terlebih dahulu.",
      });
    }

    console.log(`[POST /api/predict] Memproses gambar...`);

    // Proses klasifikasi menggunakan Service AI
    const result = await classifyScar(req.file.buffer);

    // Simpan metadata hasil analisis ke database (TIDAK menyimpan file gambar)
    const prediction = await Prediction.create({
      label: result.label,
      accuracy: result.accuracy,
    });

    // Kembalikan respons RESTful
    return res.status(201).json({
      status: "success",
      message: "Model classified successfully",
      data: {
        id: prediction.id,
        label: prediction.label,
        accuracy: prediction.accuracy,
        createdAt: prediction.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/predictions - Mengambil seluruh riwayat analisis
app.get("/api/predictions", async (req, res, next) => {
  try {
    const predictions = await Prediction.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: "success",
      results: predictions.length,
      data: predictions,
    });
  } catch (error) {
    next(error);
  }
});

// 3. DELETE /api/predictions/:id - Menghapus riwayat berdasarkan ID
app.delete("/api/predictions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Prediction.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Data tidak ditemukan.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Riwayat berhasil dihapus dari database.",
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint default info
app.get("/", (req, res) => {
  res.status(200).json({
    name: "SCARE Advanced Scar Classification Engine API",
    status: "running",
  });
});

// ==========================================
// GLOBAL ERROR HANDLING MIDDLEWARE (Crash Protection)
// ==========================================
app.use((err, req, res, next) => {
  console.error("Terjadi error pada API SCARE:", err.message);

  const statusCode = err.name === "MulterError" ? 400 : 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Terjadi kesalahan internal pada server SCARE.",
  });
});

// Menjalankan server Express hanya saat lokal.
// Di Vercel, app diekspor sebagai serverless handler dan tidak boleh listen manual.
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server Express SCARE berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
