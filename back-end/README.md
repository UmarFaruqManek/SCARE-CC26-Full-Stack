# SCARE Backend API

> **S**car **C**lassification **A**dvanced **R**easoning **E**ngine — RESTful API Server

Backend Express.js yang melayani klasifikasi gambar luka menggunakan AI, dengan penyimpanan riwayat sesi anonim ke database SQLite.

---

## Tech Stack

| Teknologi | Kegunaan |
|---|---|
| **Express.js** | Framework server HTTP |
| **Multer** | Penerimaan file gambar (in-memory, tidak disimpan ke disk) |
| **Sequelize** | ORM untuk berinteraksi dengan database |
| **SQLite3** | Database ringan untuk riwayat sesi |
| **dotenv** | Manajemen environment variables |
| **nodemon** | Auto-restart server saat development |

---

## Instalasi & Menjalankan Server

```bash
# 1. Masuk ke direktori backend
cd back-end

# 2. Install semua dependensi
npm install

# 3. Salin template environment variables
cp .env.example .env

# 4. Jalankan server (Development — auto-restart)
npm run dev

# 5. Jalankan server (Production)
npm start
```

Server akan berjalan di: `http://localhost:3000`

---

## Struktur Folder

```
back-end/
├── src/
│   ├── config/
│   │   └── database.js       # Koneksi SQLite via Sequelize
│   ├── models/
│   │   └── Prediction.js     # Skema tabel riwayat klasifikasi
│   ├── services/
│   │   └── predictService.js # Engine klasifikasi AI (ganti ini saat model asli siap)
│   └── server.js             # Entry point — semua endpoint API
├── .env                      # Environment variables (jangan di-commit!)
├── .env.example              # Template .env untuk rekan tim
├── .gitignore
├── package.json
└── vercel.json               # Konfigurasi deployment Vercel
```

---

## Dokumentasi API Endpoint

### Base URL
- **Lokal:** `http://localhost:3000`
- **Production:** `https://<nama-project>.vercel.app`

---

### `GET /`
Cek status server berjalan.

**Response:**
```json
{
  "name": "SCARE Advanced Scar Classification Engine API",
  "status": "running"
}
```

---

### `POST /api/predict`
Menerima file gambar luka, menjalankan klasifikasi AI, menyimpan metadata hasil ke database, dan mengembalikan hasil klasifikasi.

**Request:**
```
Method  : POST
URL     : /api/predict
Headers : Content-Type: multipart/form-data
Body    :
  - image     (File, wajib)   → File gambar luka (JPG/JPEG/PNG, maks 10MB)
  - sessionId (String, wajib) → ID sesi browser yang unik dan anonim
```

**Response Sukses `201`:**
```json
{
  "status": "success",
  "message": "Model classified successfully",
  "data": {
    "id": "96b0e545-29ee-4f53-94ab-6350f3da3515",
    "label": "Keloid",
    "accuracy": "94.7%",
    "createdAt": "2026-05-21T12:25:46.000Z"
  }
}
```

**Response Error `400` (tidak ada gambar):**
```json
{
  "status": "fail",
  "message": "Silakan unggah gambar luka terlebih dahulu."
}
```

**Response Error `400` (tidak ada sessionId):**
```json
{
  "status": "fail",
  "message": "Parameter sessionId wajib disertakan."
}
```

> ⚠️ **Catatan Privasi:** File gambar HANYA diproses di RAM server (in-memory buffer). Gambar tidak pernah disimpan ke disk maupun database.

---

### `GET /api/predictions`
Mengambil riwayat hasil klasifikasi.

**Request:**
```
Method : GET
URL    : /api/predictions
Query  :
  - sessionId (String, opsional) → Filter riwayat per sesi. Jika tidak diisi, kembalikan semua riwayat.
```

**Contoh:**
```
GET /api/predictions?sessionId=sess_abc123xyz
```

**Response Sukses `200`:**
```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "id": "96b0e545-...",
      "sessionId": "sess_abc123xyz",
      "label": "Keloid",
      "accuracy": "94.7%",
      "createdAt": "2026-05-21T12:30:00.000Z",
      "updatedAt": "2026-05-21T12:30:00.000Z"
    },
    {
      "id": "a1b2c3d4-...",
      "sessionId": "sess_abc123xyz",
      "label": "Hypertrophic",
      "accuracy": "91.2%",
      "createdAt": "2026-05-21T12:25:00.000Z",
      "updatedAt": "2026-05-21T12:25:00.000Z"
    }
  ]
}
```

---

### `DELETE /api/predictions`
Menghapus seluruh riwayat klasifikasi untuk sesi tertentu dari database (fitur privasi).

**Request:**
```
Method : DELETE
URL    : /api/predictions
Query  :
  - sessionId (String, wajib)
```

**Contoh:**
```
DELETE /api/predictions?sessionId=sess_abc123xyz
```

**Response Sukses `200`:**
```json
{
  "status": "success",
  "message": "Berhasil menghapus 2 riwayat sesi dari database."
}
```

---

## Schema Database

**Tabel: `Predictions`**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | ID unik otomatis (UUID v4) |
| `sessionId` | STRING | ID sesi browser yang anonim |
| `label` | STRING | Hasil klasifikasi: `"Keloid"` atau `"Hypertrophic"` |
| `accuracy` | STRING | Tingkat akurasi AI (contoh: `"94.7%"`) |
| `createdAt` | DATETIME | Waktu analisis dilakukan (otomatis) |
| `updatedAt` | DATETIME | Waktu update terakhir (otomatis) |

> ✅ **Tidak ada data gambar, nama file, IP address, atau informasi pribadi yang disimpan.**

---

## Cara Mengintegrasikan Model AI Asli

Ketika model AI sudah siap, **hanya satu file yang perlu diubah**: `src/services/predictService.js`.

Tanyakan kepada rekan yang mengerjakan model:
1. Model di-deploy di mana? (URL / file lokal)
2. Bagaimana cara memanggilnya? (HTTP / TensorFlow.js / Python)
3. Apa format output-nya? (contoh: `{ label, confidence }`)
4. Apakah gambar perlu dipreproses? (resize, normalisasi)

Kemudian ganti isi fungsi `classifyScar()` di `predictService.js`. File lain tidak perlu diubah.

---

## Deployment ke Vercel

```bash
# Pastikan vercel.json sudah ada di root folder back-end/
# Kemudian push ke GitHub dan hubungkan ke Vercel dashboard

# Root Directory di Vercel: back-end/
# Framework Preset       : Other
# Build Command          : (kosongkan)
# Output Directory       : (kosongkan)
```
