<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
  
  <br><br>
  <h1>SCARE: Front-End UI Architecture</h1>
  <p><b>Interactive Clinical Interface for Advanced Scar Classification Engine</b></p>
</div>

---

## 📖 Project Overview
**SCARE Front-End** adalah antarmuka pengguna berbasis web yang dirancang untuk menjadi jembatan antara teknologi *Deep Learning* dan tenaga medis. Fokus utama dari *repository* ini adalah memberikan pengalaman pengguna (UX) yang intuitif, cepat, dan reliabel dalam melakukan triage dermatologi.

Antarmuka ini memungkinkan pengguna untuk mengambil foto luka secara langsung via kamera perangkat atau mengunggah file, melakukan penyesuaian area pindaian (*cropping*), hingga mendapatkan protokol pengobatan medis yang divalidasi oleh sistem pakar berbasis AI.

---

## 🛠️ Tech Stack & UI Justification

Pemilihan teknologi difokuskan pada performa *client-side*, kemudahan integrasi API, dan estetika medis yang modern:

### 1. Framework: `React.js` (Vite)
* **Mengapa:** Menggunakan arsitektur berbasis komponen untuk memastikan skalabilitas kode. **Vite** dipilih sebagai *build tool* karena kecepatan *Hot Module Replacement* (HMR) yang jauh lebih unggul dibanding CRA, mempercepat siklus pengembangan.

### 2. Styling: `Tailwind CSS`
* **Mengapa:** Memungkinkan kustomisasi UI yang sangat presisi dengan sistem *utility-first*. Hal ini sangat krusial untuk membangun desain responsif yang konsisten di berbagai ukuran layar perangkat medis (tablet, ponsel, hingga desktop).

### 3. Motion & Interaction: `Framer Motion`
* **Mengapa:** Memberikan sentuhan *premium feel* melalui animasi *staggered fade-up* dan transisi antar *state* yang mulus. Animasi ini bukan sekadar estetika, melainkan berfungsi sebagai *visual cue* untuk memandu alur kerja pengguna (UX).

### 4. Image Processing: `React Easy Crop`
* **Mengapa:** Memberikan kontrol penuh kepada pengguna untuk menentukan area pindaian secara presisi (1:1 aspect ratio). Hal ini krusial agar model AI mendapatkan input data gambar yang fokus pada area luka, meminimalisir *noise* latar belakang.

---

## 🏗️ Folder Structure & Architecture

Proyek ini memisahkan direktori UI ke dalam folder `front-end/` dan mengikuti standar arsitektur yang sangat rapi untuk memudahkan pemeliharaan serta kolaborasi *Full-Stack*:

* `src/assets/`: Menyimpan aset gambar klinis dan logo identitas SCARE.
* `src/components/`: Berisi komponen *reusable* untuk membangun antarmuka, mencakup komponen mandiri seperti `ScrollToTop.jsx` dan sub-folder spesifik:
    * `layout/`: Komponen struktural seperti `Navbar.jsx` dan `Footer.jsx`.
    * `ui/`: Komponen antarmuka mikro seperti `ScarCard.jsx` dan `ChecklistItem.jsx`.
* `src/hooks/`: Tempat untuk menyimpan *Custom React Hooks* guna memisahkan logika dari tampilan.
* `src/layouts/`: Berisi `MainLayout.jsx` sebagai pembungkus utama tata letak halaman.
* `src/pages/`: Halaman utama aplikasi yang dipecah per fitur:
    * **Home**: Beranda dan edukasi perbedaan Keloid vs Hypertrophic.
    * **Analysis**: Modul kamera, *upload*, dan integrasi pemrosesan AI.
    * **Treatment**: Dashboard hasil diagnosis dan protokol pengobatan.
    * **NotFound**: Penanganan halaman tidak ditemukan (404).
    * **ServerError**: Penanganan kegagalan sistem AI/API (500).
* `src/services/`: Berisi konfigurasi dan logika untuk komunikasi data ke API Back-End.
* `src/utils/`: Menyimpan fungsi-fungsi *helper* atau utilitas pendukung yang dapat digunakan berulang di seluruh aplikasi dan logika untuk komunikasi data ke API Back-End.

---

## 🔬 Key UX Features

1.  **Smart Camera Interface**: Integrasi kamera *environment-facing* dengan penanganan izin akses yang aman.
2.  **State-Driven Transitions**: Penggunaan `AnimatePresence` untuk transisi mulus antara tahap *Upload* -> *Crop* -> *Processing* -> *Result*.
3.  **Medical-Grade Visualization**: Tagging otomatis (Aggressive vs Stabilized growth) berdasarkan hasil klasifikasi untuk membantu keputusan klinis.
4.  **Error Boundary & Fallback**: Sistem proteksi yang mencegah aplikasi *crash* jika pengguna mencoba mengakses halaman hasil tanpa data analisis.

---

## 💻 Instalasi Lokal (Running the Project)

Untuk menjalankan *Front-End* SCARE di lingkungan pengembangan Anda:

```bash
# 1. Clone Repositori (Branch full-stack)
git clone -b full-stack [https://github.com/Kyyneko/SCARE-CC26.git](https://github.com/Kyyneko/SCARE-CC26.git)
cd SCARE-CC26

# 2. Install Dependensi (Pastikan Node.js sudah terinstal)
npm install

# 3. Jalankan Aplikasi dalam Mode Development
npm run dev

# 4. Akses Aplikasi
# Buka http://localhost:5173 di browser Anda