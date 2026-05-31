# SCARE Backend API

Backend REST API untuk aplikasi SCARE. Service ini menerima gambar luka dari frontend, meneruskan gambar ke model AI jika `MODEL_API_URL` tersedia, menyimpan metadata hasil prediksi ke SQLite, dan menyediakan endpoint untuk membaca atau menghapus riwayat prediksi.

## Ringkasan

| Item | Keterangan |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Upload file | Multer, in-memory buffer |
| Database | SQLite via Sequelize |
| Default port | `3000` |
| Base URL lokal | `http://localhost:3000` |

## Struktur Folder

```txt
back-end/
  src/
    config/
      database.js
    models/
      Prediction.js
    services/
      predictService.js
    server.js
  .env.example
  package.json
  vercel.json
```

## Menjalankan Lokal

```bash
cd back-end
npm install
copy .env.example .env
npm run dev
```

Server akan berjalan di:

```txt
http://localhost:3000
```

Untuk production lokal:

```bash
npm start
```

## Environment Variables

Buat file `.env` dari `.env.example`.

```env
PORT=3000
NODE_ENV=development
MODEL_API_URL=
```

| Variable | Wajib | Keterangan |
|---|---:|---|
| `PORT` | Tidak | Port server Express. Default `3000`. |
| `NODE_ENV` | Tidak | Mode runtime, contoh `development` atau `production`. |
| `MODEL_API_URL` | Tidak | URL endpoint model AI. Jika kosong, backend memakai mock classifier. |

Contoh saat model sudah dideploy:

```env
MODEL_API_URL=https://nama-model.vercel.app/predict/
```

## Alur Kerja API

1. Frontend mengirim gambar ke `POST /api/predict` dengan field form-data bernama `image`.
2. Backend membaca gambar di memory, tidak menyimpan file gambar ke disk.
3. Jika `MODEL_API_URL` kosong, backend memakai mock classifier deterministik.
4. Jika `MODEL_API_URL` diisi, backend mengirim gambar ke endpoint model dengan field form-data bernama `file`.
5. Backend menyimpan metadata hasil ke SQLite: `label` dan `accuracy`.
6. Backend mengirim response ke frontend.

## Format Response Umum

Response sukses memakai format:

```json
{
  "status": "success",
  "message": "...",
  "data": {}
}
```

Response error memakai format:

```json
{
  "status": "error",
  "message": "Pesan error"
}
```

Beberapa validasi memakai:

```json
{
  "status": "fail",
  "message": "Pesan validasi"
}
```

## Endpoint

### GET `/`

Mengecek apakah backend berjalan.

**Response 200**

```json
{
  "name": "SCARE Advanced Scar Classification Engine API",
  "status": "running"
}
```

**Contoh curl**

```bash
curl http://localhost:3000/
```

### POST `/api/predict`

Mengunggah gambar luka, menjalankan klasifikasi, menyimpan hasil prediksi, dan mengembalikan metadata hasil.

**Content-Type**

```txt
multipart/form-data
```

**Body**

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `image` | File | Ya | File gambar. MIME type harus diawali `image/`. |

**Batas ukuran file**

```txt
10 MB
```

**Response 201**

```json
{
  "status": "success",
  "message": "Model classified successfully",
  "data": {
    "id": "96b0e545-29ee-4f53-94ab-6350f3da3515",
    "label": "Keloid",
    "accuracy": "94.7%",
    "createdAt": "2026-05-31T10:25:46.000Z"
  }
}
```

**Response 400 jika gambar tidak dikirim**

```json
{
  "status": "fail",
  "message": "Silakan unggah gambar luka terlebih dahulu."
}
```

**Response 400 jika file bukan gambar**

```json
{
  "status": "error",
  "message": "Hanya file gambar (JPG, JPEG, PNG) yang diperbolehkan!"
}
```

**Contoh curl**

```bash
curl -X POST http://localhost:3000/api/predict \
  -F "image=@./sample.jpg"
```

**Contoh JavaScript**

```js
const formData = new FormData();
formData.append("image", fileInput.files[0]);

const response = await fetch("http://localhost:3000/api/predict", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result);
```

### GET `/api/predictions`

Mengambil seluruh riwayat prediksi, diurutkan dari data terbaru.

**Response 200**

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "id": "96b0e545-29ee-4f53-94ab-6350f3da3515",
      "label": "Keloid",
      "accuracy": "94.7%",
      "createdAt": "2026-05-31T10:25:46.000Z",
      "updatedAt": "2026-05-31T10:25:46.000Z"
    },
    {
      "id": "a1b2c3d4-29ee-4f53-94ab-6350f3da3515",
      "label": "Hypertrophic",
      "accuracy": "91.2%",
      "createdAt": "2026-05-31T10:10:00.000Z",
      "updatedAt": "2026-05-31T10:10:00.000Z"
    }
  ]
}
```

**Contoh curl**

```bash
curl http://localhost:3000/api/predictions
```

### DELETE `/api/predictions/:id`

Menghapus satu riwayat prediksi berdasarkan `id`.

**Path parameter**

| Parameter | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `id` | UUID | Ya | ID prediksi yang ingin dihapus. |

**Response 200**

```json
{
  "status": "success",
  "message": "Riwayat berhasil dihapus dari database."
}
```

**Response 404 jika data tidak ditemukan**

```json
{
  "status": "fail",
  "message": "Data tidak ditemukan."
}
```

**Contoh curl**

```bash
curl -X DELETE http://localhost:3000/api/predictions/96b0e545-29ee-4f53-94ab-6350f3da3515
```

## Skema Database

Tabel: `Predictions`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Primary key, dibuat otomatis. |
| `label` | String | Hasil klasifikasi, contoh `Keloid` atau `Hypertrophic`. |
| `accuracy` | String | Confidence dalam format persen, contoh `94.7%`. |
| `createdAt` | Date | Waktu data dibuat. |
| `updatedAt` | Date | Waktu data terakhir diperbarui. |

File gambar tidak disimpan ke database. Yang disimpan hanya metadata hasil prediksi.

## Integrasi Dengan Model API

Backend mengharapkan endpoint model menerima:

```txt
POST /predict/
Content-Type: multipart/form-data
Field: file
```

Backend mengharapkan response model memiliki minimal field:

```json
{
  "label": "Keloid",
  "accuracy": "94.7%"
}
```

Jika response model tidak memiliki `label` atau `accuracy`, backend akan mengembalikan error.

## Deploy ke Vercel

Jika deploy sebagai project sendiri di Vercel:

```txt
Root Directory: back-end
Framework Preset: Other
Build Command: kosongkan
Output Directory: kosongkan
```

Tambahkan environment variable di Vercel:

```env
MODEL_API_URL=https://nama-model.vercel.app/predict/
NODE_ENV=production
```

Catatan: SQLite lokal di serverless environment tidak ideal untuk data production jangka panjang. Untuk production yang stabil, gunakan database eksternal seperti PostgreSQL, MySQL, atau layanan database managed.
