# SCARE Model API

Model API adalah service FastAPI untuk menjalankan inference file `scar_model.tflite`. API ini menerima gambar luka, melakukan preprocessing, menjalankan model TensorFlow Lite, lalu mengembalikan label prediksi beserta confidence score.

## Ringkasan

| Item | Keterangan |
|---|---|
| Runtime | Python |
| Framework | FastAPI |
| Model file | `scar_model.tflite` |
| Endpoint prediksi | `POST /predict/` |
| Field upload | `file` |
| Label output | `Hypertrophic`, `Keloid` |
| Base URL lokal | `http://127.0.0.1:8000` |

## Struktur Folder

```txt
model/
  app.py
  main.py
  requirements.txt
  scar_model.tflite
```

| File | Keterangan |
|---|---|
| `app.py` | Entry point untuk platform seperti Vercel. |
| `main.py` | FastAPI app, preprocessing, dan inference model. |
| `requirements.txt` | Dependency Python. |
| `scar_model.tflite` | File model TFLite. |

## Menjalankan Lokal

```bash
cd model
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Server lokal akan berjalan di:

```txt
http://127.0.0.1:8000
```

Dokumentasi Swagger otomatis FastAPI:

```txt
http://127.0.0.1:8000/docs
```

## Endpoint

### GET `/`

Mengecek status model API dan apakah model berhasil dimuat.

**Response 200**

```json
{
  "status": "active",
  "message": "Scar Classification API is running.",
  "model_loaded": true,
  "instructions": "Send a POST request with an image file to /predict/."
}
```

**Contoh curl**

```bash
curl http://127.0.0.1:8000/
```

### POST `/predict/`

Mengirim gambar luka untuk diklasifikasikan oleh model.

**Content-Type**

```txt
multipart/form-data
```

**Body**

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `file` | File | Ya | File gambar luka. MIME type harus diawali `image/`. |

**Response 200**

```json
{
  "label": "Keloid",
  "accuracy": "94.7%",
  "prediction": "Keloid",
  "confidence": 0.947,
  "all_scores": {
    "Hypertrophic": 0.053,
    "Keloid": 0.947
  }
}
```

Field penting untuk backend utama:

| Field | Tipe | Keterangan |
|---|---|---|
| `label` | String | Label hasil prediksi. Dipakai oleh backend Node. |
| `accuracy` | String | Confidence dalam persen. Dipakai oleh backend Node. |
| `prediction` | String | Sama seperti `label`, disediakan untuk debugging/kompatibilitas. |
| `confidence` | Number | Confidence mentah dari model. |
| `all_scores` | Object | Score untuk semua kelas. |

**Response 400 jika file bukan gambar**

```json
{
  "detail": "File provided is not an image."
}
```

**Response 503 jika model tidak ditemukan atau belum dimuat**

```json
{
  "detail": "Model not loaded. Please ensure scar_model.tflite is in the /model directory."
}
```

**Response 500 jika inference gagal**

```json
{
  "detail": "Inference error: <pesan error>"
}
```

**Contoh curl**

```bash
curl -X POST http://127.0.0.1:8000/predict/ \
  -F "file=@./sample.jpg"
```

**Contoh JavaScript**

```js
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://127.0.0.1:8000/predict/", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result);
```

## Cara Kerja Preprocessing

1. API menerima file gambar dari field `file`.
2. Gambar dibuka menggunakan Pillow dan dikonversi ke RGB.
3. Gambar di-resize mengikuti input shape model.
4. Pixel dikonversi ke `float32`.
5. Nilai pixel dinormalisasi ke rentang `0.0` sampai `1.0`.
6. Batch dimension ditambahkan sebelum inference.

## Integrasi Dengan Backend Node

Backend Node mengirim file ke model dengan field:

```txt
file
```

Model wajib mengembalikan minimal:

```json
{
  "label": "Keloid",
  "accuracy": "94.7%"
}
```

Setelah model API dideploy, masukkan URL endpoint model ke `.env` backend:

```env
MODEL_API_URL=https://nama-model.vercel.app/predict/
```

## Deploy ke Vercel

Jika deploy dari dashboard Vercel:

```txt
Root Directory: model
Framework Preset: Other
Build Command: kosongkan
Output Directory: kosongkan
```

Jika deploy dari terminal:

```bash
cd model
vercel
vercel --prod
```

Endpoint setelah deploy:

```txt
https://nama-project.vercel.app/predict/
```

## Catatan Deployment

- Pastikan `scar_model.tflite` ada di folder `model/`.
- Upload gambar ke Vercel Function memiliki limit ukuran request. Kompres gambar dari frontend jika perlu.
- Dependency `ai-edge-litert` dipakai agar inference TFLite lebih ringan daripada full TensorFlow.
- Jika deploy ke platform selain Vercel, jalankan app dengan `uvicorn main:app`.
