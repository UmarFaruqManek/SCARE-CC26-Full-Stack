# SCARE CC26

SCARE adalah aplikasi full-stack untuk klasifikasi luka bekas menjadi `Hypertrophic` atau `Keloid`. Project ini terdiri dari tiga service utama:

```txt
SCARE-CC26/
  model/      # FastAPI + TFLite model inference
  back-end/   # Express.js REST API + SQLite
  front-end/  # React + Vite web app
```

## Prasyarat

Pastikan sudah terinstall:

| Tool | Kegunaan |
|---|---|
| Node.js | Menjalankan frontend dan backend |
| npm | Menginstall dependency JavaScript |
| Python | Menjalankan model API |
| Git | Clone dan version control |

## Clone Project

```bash
git clone https://github.com/UmarFaruqManek/SCARE-CC26-Full-Stack.git
cd SCARE-CC26-Full-Stack
```

Jika memakai repo asal:

```bash
git clone -b full-stack https://github.com/Kyyneko/SCARE-CC26.git
cd SCARE-CC26
```

## Cara Menjalankan Project

Jalankan tiga service berikut di terminal yang berbeda.

### 1. Jalankan Model API

Model API menerima gambar dan mengembalikan hasil klasifikasi dari `scar_model.tflite`.

```bash
cd model
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Model API berjalan di:

```txt
http://127.0.0.1:8000
```

Endpoint prediksi model:

```txt
POST http://127.0.0.1:8000/predict/
```

### 2. Jalankan Backend API

Buka terminal baru:

```bash
cd back-end
npm install
copy .env.example .env
npm run dev
```

Backend berjalan di:

```txt
http://localhost:3000
```

Agar backend memakai model lokal, isi file `back-end/.env`:

```env
PORT=3000
NODE_ENV=development
MODEL_API_URL=http://127.0.0.1:8000/predict/
```

Jika `MODEL_API_URL` dikosongkan, backend akan memakai mock classifier.

Endpoint utama backend:

```txt
GET    http://localhost:3000/
POST   http://localhost:3000/api/predict
GET    http://localhost:3000/api/predictions
DELETE http://localhost:3000/api/predictions/:id
```

### 3. Jalankan Frontend

Buka terminal baru:

```bash
cd front-end
npm install
npm run dev
```

Frontend berjalan di:

```txt
http://localhost:5173
```

## Urutan Menjalankan Yang Disarankan

1. Jalankan `model` di port `8000`.
2. Jalankan `back-end` di port `3000`.
3. Jalankan `front-end` di port `5173`.
4. Buka frontend di browser.
5. Upload gambar melalui halaman analisis.

## Konfigurasi API

Frontend mengirim request ke backend. Backend mengirim gambar ke model.

```txt
Front-end -> Back-end -> Model API
```

Pastikan backend `.env` mengarah ke model API yang benar:

```env
MODEL_API_URL=http://127.0.0.1:8000/predict/
```

Jika model sudah dideploy, ganti menjadi URL production:

```env
MODEL_API_URL=https://nama-model.vercel.app/predict/
```

## Build Frontend

Untuk membuat production build frontend:

```bash
cd front-end
npm run build
```

Preview hasil build:

```bash
npm run preview
```

## Dokumentasi Per Service

Dokumentasi lebih detail tersedia di:

```txt
model/README.md
back-end/README.md
front-end/README.md
```

## Catatan Penting

- Jangan commit file `.env`.
- Jangan commit `node_modules`.
- Jangan commit database lokal seperti `database.sqlite`.
- File gambar tidak disimpan oleh backend; gambar hanya diproses di memory.
- Untuk deployment Vercel, setiap folder dapat dibuat sebagai project terpisah:
  - `model`
  - `back-end`
  - `front-end`
