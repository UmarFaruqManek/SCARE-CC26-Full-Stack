# SCARE Model API

FastAPI service for serving `scar_model.tflite`.

## Local Run

```bash
cd model
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open:

```txt
http://127.0.0.1:8000/
```

Prediction endpoint:

```txt
POST http://127.0.0.1:8000/predict/
```

Use multipart form-data with field name `file`.

## Deploy to Vercel

In Vercel dashboard:

```txt
Repository: Kyyneko/SCARE-CC26
Branch: full-stack
Root Directory: model
```

Then deploy. After deployment, the model endpoint will be:

```txt
https://your-vercel-project.vercel.app/predict/
```

Use that URL in the Node backend:

```env
MODEL_API_URL=https://your-vercel-project.vercel.app/predict/
```
