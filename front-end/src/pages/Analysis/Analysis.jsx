import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FiCamera,
  FiUploadCloud,
  FiCheck,
  FiX,
  FiRefreshCcw,
  FiLoader,
} from "react-icons/fi";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL("image/png");
};

const dataURLtoBlob = (dataurl) => {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export default function Analysis() {
  const navigate = useNavigate();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [finalCroppedImage, setFinalCroppedImage] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setMediaStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin pada browser.",
      );
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    setMediaStream(null);
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");

      setImageSource(imageData);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const cleanImageData = canvas.toDataURL("image/png");
        setImageSource(cleanImageData);
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    try {
      // 1. Dapatkan file cropped base64
      const croppedImage = await getCroppedImg(imageSource, croppedAreaPixels);
      setFinalCroppedImage(croppedImage);

      // 2. Konversi Base64 ke Blob & File
      const blob = dataURLtoBlob(croppedImage);
      const file = new File([blob], "scar_scan.png", { type: "image/png" });

      // 3. Buat FormData payload
      const formData = new FormData();
      formData.append("image", file);

      // 4. Lakukan Networking Call (Kriteria 1) ke Express Backend menggunakan Axios
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const { data: resData } = await axios.post(
        `${API_URL}/api/predict`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (resData.status === "success") {
        setAnalysisResult({
          label: resData.data.label,
          accuracy: resData.data.accuracy,
        });
      } else {
        throw new Error(resData.message || "Terjadi kesalahan analisis.");
      }
    } catch (e) {
      console.error("Analysis error:", e);
      // Proteksi Crash: Navigasi ke Server Error page jika terjadi crash/kegagalan sistem
      navigate("/500");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setImageSource(null);
    setAnalysisResult(null);
    setFinalCroppedImage(null);
    setZoom(1);
  };

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  const leftColVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardStateVariants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-12 flex justify-center items-start overflow-x-clip">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-16 lg:gap-12 items-center lg:items-start justify-between">
        {/* --- KOLOM KIRI: Informasi & Benefit --- */}
        <motion.div
          variants={leftColVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 lg:w-6/12 w-full pt-4 relative"
        >
          <div className="absolute -top-15 -left-57 w-72 h-72 md:w-[785px] md:h-[785px] bg-[#00BEE1] rounded-full mix-blend-multiply filter blur-[130px] opacity-8 pointer-events-none"></div>

          <div className="relative z-10">
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight"
            >
              Advance AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DC9E5] to-[#00687B]">
                Scar Classification
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-[#545454] text-xl mb-12 leading-relaxed max-w-xl"
            >
              SCARE utilizes advanced Artificial Intelligence technology to
              accurately analyze and classify scar types. Get instant, medically
              validated evaluations to help determine the most appropriate
              treatment path.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-8 mb-14"
            >
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full bg-[#4DC9E5] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  <FiCheck className="text-white w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">
                    Instant Analysis
                  </h3>
                  <p className="text-[#545454] text-base mt-1">
                    Get comprehensive results within seconds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full bg-[#4DC9E5] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  <FiCheck className="text-white w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">
                    Medical Grade
                  </h3>
                  <p className="text-[#545454] text-base mt-1">
                    Developed with clinical standards and validation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full bg-[#4DC9E5] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  <FiCheck className="text-white w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">
                    Confidential
                  </h3>
                  <p className="text-[#545454] text-base mt-1">
                    Your data is encrypted and HIPAA compliant
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="w-full max-w-xl border-t border-gray-200 pt-8"
            >
              <p className="text-[#545454] text-base">
                Start your assessment now. No registration required.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* --- KOLOM KANAN: Kartu Scanner Dinamis --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-5/12 max-w-lg flex justify-center relative z-10"
        >
          <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 p-10 sm:p-12">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <canvas ref={canvasRef} className="hidden"></canvas>

            <AnimatePresence mode="wait">
              {/* KONDISI 1: HASIL ANALISIS SELESAI */}
              {analysisResult ? (
                <motion.div
                  key="result"
                  variants={cardStateVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center text-center"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Analysis Complete
                  </h2>
                  <div className="w-full max-w-[260px] aspect-square rounded-[1.5rem] overflow-hidden bg-gray-200 mb-6 shadow-inner">
                    <img
                      src={finalCroppedImage}
                      alt="Analyzed Scar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-5xl font-bold text-[#00687B] mb-2">
                    {analysisResult.label}
                  </h3>
                  <p className="text-[#545454] text-lg mb-8">
                    {analysisResult.accuracy} Accuracy Rate
                  </p>

                  <button
                    onClick={() =>
                      navigate("/treatment", {
                        state: {
                          image: finalCroppedImage,
                          resultData: analysisResult,
                        },
                      })
                    }
                    className="w-full py-4 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:bg-[#58A1B0] text-white font-medium text-lg rounded-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-[#4DC9E5]/60 hover:brightness-110 active:scale-95 active:translate-y-0 active:shadow-md cursor-pointer"
                  >
                    View Treatment
                  </button>
                  <button
                    onClick={handleRetake}
                    className="mt-4 text-[#545454] hover:text-[#00687B] text-sm font-medium transition-colors underline-offset-4 hover:underline cursor-pointer"
                  >
                    Analyze another photo
                  </button>
                </motion.div>
              ) : /* KONDISI 2: SEDANG LOADING AI */
              isAnalyzing ? (
                <motion.div
                  key="loading"
                  variants={cardStateVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center justify-center min-h-[350px] text-center"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#4DC9E5] rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#00687B]">
                      <FiLoader size={28} className="animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Processing Image
                  </h2>
                  <p className="text-[#545454]">
                    Our AI is evaluating the scar characteristics...
                  </p>
                </motion.div>
              ) : /* KONDISI 3: FITUR CROP (ADJUST IMAGE) */
              imageSource ? (
                <motion.div
                  key="cropping"
                  variants={cardStateVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center text-center"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Adjust Image
                  </h2>
                  <p className="text-sm text-[#545454] mb-6">
                    Pinch to zoom and drag to center the scar.
                  </p>

                  <div className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden mb-6 border border-gray-200 shadow-sm">
                    <Cropper
                      image={imageSource}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      objectFit="contain"
                    />
                  </div>

                  <div className="w-full flex items-center gap-4 mb-8 px-2">
                    <span className="text-sm font-medium text-gray-500">
                      Zoom
                    </span>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(e.target.value)}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00687B]"
                    />
                  </div>

                  <div className="flex w-full gap-4">
                    <button
                      onClick={handleRetake}
                      className="flex-1 py-4 text-[#545454] bg-gray-100 hover:bg-gray-200 font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiRefreshCcw /> Retake
                    </button>
                    <button
                      onClick={handleAnalyze}
                      className="flex-1 py-4 text-white bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:bg-[#58A1B0] font-medium text-lg rounded-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-[#4DC9E5]/60 hover:brightness-110 active:scale-95 active:translate-y-0 active:shadow-md cursor-pointer"
                    >
                      Analyze Image
                    </button>
                  </div>
                </motion.div>
              ) : /* KONDISI 4: LIVE CAMERA DENGAN CALLBACK REF YANG BENAR */
              isCameraActive ? (
                <motion.div
                  key="camera"
                  variants={cardStateVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center w-full"
                >
                  <div className="flex justify-between items-center w-full mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Live Camera
                    </h2>
                    <button
                      onClick={stopCamera}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <div className="w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden relative mb-6">
                    <video
                      ref={(node) => {
                        videoRef.current = node;
                        if (node && mediaStream) {
                          node.srcObject = mediaStream;
                        }
                      }}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    ></video>
                  </div>
                  <button
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full border-4 border-[#4DC9E5] bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#4DC9E5]"></div>
                  </button>
                  <p className="text-sm text-[#545454] mt-4">Tap to capture</p>
                </motion.div>
              ) : (
                /* KONDISI 5: TAMPILAN AWAL MINTA INPUT */
                <motion.div
                  key="upload"
                  variants={cardStateVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Initiate Scan
                    </h2>
                    <p className="text-[#545454] text-base">
                      Select input method for analysis
                    </p>
                  </div>

                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:bg-[#58A1B0] text-white font-medium py-4 text-lg rounded-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-[#4DC9E5]/60 hover:brightness-110 active:scale-95 active:translate-y-0 active:shadow-md cursor-pointer"
                  >
                    <FiCamera className="w-6 h-6" />
                    Take Photo
                  </button>

                  <div className="flex items-center gap-4 my-10">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-[#545454] text-sm font-semibold tracking-wider">
                      OR
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-full min-h-[280px] border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-cyan-50/50 rounded-2xl p-8 flex flex-col items-center justify-center transition-colors duration-300 cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-200/70 group-hover:bg-[#4DC9E5]/20 flex items-center justify-center text-[#00687B] group-hover:text-[#4DC9E5] mb-6 transition-all duration-300">
                      <FiUploadCloud className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">
                      Upload Scar Photo
                    </h3>
                    <p className="text-sm text-[#545454] font-medium">
                      JPG, JPEG, PNG, up to 10MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
