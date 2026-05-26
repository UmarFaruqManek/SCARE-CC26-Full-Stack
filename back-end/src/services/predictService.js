const crypto = require("crypto");
const fetch = require("node-fetch");
const FormData = require("form-data");

// ================================================================
// SCARE — AI Classification Service
//
// Sistem ini bekerja secara otomatis:
//
// [MODE PRODUCTION] Jika MODEL_API_URL diisi di .env:
//   → Gambar dikirim ke Flask API Tim AI
//   → Hasil nyata dari model EfficientFormer dikembalikan
//
// [MODE DEVELOPMENT] Jika MODEL_API_URL kosong di .env:
//   → Gambar dianalisis menggunakan mock deterministik
//   → Digunakan selama Flask API Tim AI belum tersedia
//
// Untuk beralih ke mode production:
//   Isi MODEL_API_URL di file .env dengan URL dari Tim AI
//   Contoh: MODEL_API_URL=https://scare-model.railway.app/predict
// ================================================================

/**
 * Mengirim gambar ke Flask API Tim AI dan mendapatkan hasil klasifikasi.
 * @param {Buffer} imageBuffer - Buffer gambar yang diterima dari Multer
 * @returns {Promise<{label: string, accuracy: string}>}
 */
async function callFlaskAPI(imageBuffer) {
  const form = new FormData();
  form.append("file", imageBuffer, {
    filename: "scar_scan.png",
    contentType: "image/png",
  });
  // ↑ Kirim gambar ke Flask Tim AI
  //   "file" = nama field yang diminta Flask (konfirmasi ke Tim AI)

  console.log(`[AI Service] Menghubungi Flask API: ${process.env.MODEL_API_URL}`);

  const response = await fetch(process.env.MODEL_API_URL, {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
    timeout: 30000, // Timeout 30 detik
  });

  if (!response.ok) {
    throw new Error(`Flask API merespons dengan status: ${response.status}`);
  }

  const result = await response.json();
  // ↑ result = JSON yang dikembalikan Flask Tim AI
  //   Contoh yang diharapkan: { "label": "Keloid", "accuracy": "94.7%" }

  // Validasi response dari Flask memiliki field yang dibutuhkan
  if (!result.label || !result.accuracy) {
    throw new Error(
      `Response Flask API tidak memiliki field yang dibutuhkan. ` +
      `Diterima: ${JSON.stringify(result)}`
    );
  }

  return {
    label: result.label,
    accuracy: result.accuracy,
  };
}

/**
 * Mock classifier deterministik — digunakan selama Flask API belum tersedia.
 * Gambar yang sama SELALU menghasilkan prediksi yang sama.
 * @param {Buffer} imageBuffer
 * @returns {{label: string, accuracy: string}}
 */
function runMockClassifier(imageBuffer) {
  const hash = crypto.createHash("sha256").update(imageBuffer).digest("hex");
  const decimalVal = parseInt(hash.substring(0, 8), 16);
  const isKeloid = decimalVal % 2 !== 0;
  const accuracyBase = 90.0 + (decimalVal % 100) / 10;

  return {
    label: isKeloid ? "Keloid" : "Hypertrophic",
    accuracy: `${accuracyBase.toFixed(1)}%`,
  };
}

/**
 * Fungsi utama klasifikasi — dipanggil oleh server.js.
 * Otomatis memilih antara Flask API atau Mock berdasarkan .env.
 * @param {Buffer} imageBuffer
 * @returns {Promise<{label: string, accuracy: string}>}
 */
async function classifyScar(imageBuffer) {
  if (!imageBuffer || imageBuffer.length === 0) {
    throw new Error("Buffer gambar kosong atau tidak valid.");
  }

  const modelApiUrl = process.env.MODEL_API_URL;

  if (modelApiUrl && modelApiUrl.trim() !== "") {
    // ✅ MODE PRODUCTION: Gunakan Flask API Tim AI
    console.log("[AI Service] Mode: PRODUCTION (Flask API Tim AI)");
    return await callFlaskAPI(imageBuffer);
  } else {
    // 🔧 MODE DEVELOPMENT: Gunakan Mock Classifier
    console.log("[AI Service] Mode: DEVELOPMENT (Mock — Flask API belum tersedia)");
    return runMockClassifier(imageBuffer);
  }
}

module.exports = { classifyScar };
