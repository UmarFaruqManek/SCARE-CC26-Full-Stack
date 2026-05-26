require("dotenv").config(); // Muat variabel dari file .env sebelum apapun

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { classifyScar } = require("./services/predictService");

const app = express();
const PORT = process.env.PORT || 3000;
const useMemoryStore =
  process.env.VERCEL && !process.env.DATABASE_URL && process.env.USE_SQLITE !== "true";
const memoryPredictions = [];

let sequelize = null;
let Prediction = null;
let databaseReadyPromise = null;
let databaseInitError = null;

if (!useMemoryStore) {
  try {
    sequelize = require("./config/database");
    Prediction = require("./models/Prediction");
  } catch (error) {
    databaseInitError = error;
    console.error("Gagal inisialisasi database:", error.message);
  }
}

// Middleware wajib
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (useMemoryStore) {
  console.log("Mode Vercel: menggunakan in-memory prediction store.");
}

async function ensureDatabaseReady() {
  if (useMemoryStore) {
    return;
  }

  if (databaseInitError) {
    throw databaseInitError;
  }

  if (!sequelize || !Prediction) {
    throw new Error("Database belum terinisialisasi.");
  }

  if (!databaseReadyPromise) {
    databaseReadyPromise = sequelize
      .authenticate()
      .then(() => sequelize.sync({ force: false }))
      .then(() => console.log("Database berhasil disinkronisasi."))
      .catch((error) => {
        databaseReadyPromise = null;
        throw error;
      });
  }

  return databaseReadyPromise;
}

async function createPredictionRecord({ label, accuracy }) {
  if (!useMemoryStore) {
    await ensureDatabaseReady();
    return Prediction.create({ label, accuracy });
  }

  const now = new Date();
  const prediction = {
    id: crypto.randomUUID(),
    label,
    accuracy,
    createdAt: now,
    updatedAt: now,
  };

  memoryPredictions.unshift(prediction);
  return prediction;
}

async function findPredictionRecords() {
  if (!useMemoryStore) {
    await ensureDatabaseReady();
    return Prediction.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  return memoryPredictions;
}

async function deletePredictionRecord(id) {
  if (!useMemoryStore) {
    await ensureDatabaseReady();
    return Prediction.destroy({
      where: { id },
    });
  }

  const index = memoryPredictions.findIndex((prediction) => prediction.id === id);
  if (index === -1) {
    return 0;
  }

  memoryPredictions.splice(index, 1);
  return 1;
}

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
    const prediction = await createPredictionRecord({
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
    const predictions = await findPredictionRecords();

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

    const deleted = await deletePredictionRecord(id);

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

app.get("/api/health/db", async (req, res) => {
  try {
    await ensureDatabaseReady();

    return res.status(200).json({
      status: "success",
      store: useMemoryStore ? "memory" : process.env.DATABASE_URL ? "postgres" : "sqlite",
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      connected: !useMemoryStore,
      message: useMemoryStore
        ? "Menggunakan in-memory store karena DATABASE_URL belum tersedia."
        : "Database connected.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      store: process.env.DATABASE_URL ? "postgres" : "sqlite",
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      connected: false,
      message: error.message,
    });
  }
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
