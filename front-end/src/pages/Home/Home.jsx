import React from "react";
import ScarCard from "../../components/ui/ScarCard";
import keloidImage from "../../assets/keloid-picture.jpg";
import hypertrophicImage from "../../assets/hypertrophic-picture.jpg";
import { FiUploadCloud, FiCpu, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const keloidChecklist = [
    "Extends Margins",
    "High Recurrence",
    "Fibroblast Prolif",
    "Chronic Pruritus",
  ];

  const hypertrophicChecklist = [
    "Stays Within Wound",
    "May-Self Regress",
    "Collagen Oriented",
    "Tensile Response",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col items-center overflow-x-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        {/* 1. Header Section */}
        <motion.section
          variants={itemVariants}
          className="text-center mb-16 md:mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black text-[#00687B] leading-tight">
            Scar Classification and Recognition Engine
          </h1>
          <p className="max-w-4xl mx-auto text-[#545454] mt-5 text-xl leading-relaxed font-normal">
            An advanced, AI-driven Clinical Decision Support System engineered
            to classify keloid and hypertrophic scars with high accuracy,
            providing medical professionals with the objective insights needed
            to prevent misdiagnosis and optimize treatment plans.
          </p>
        </motion.section>

        {/* 2. Kartu Perbandingan (ScarCards) */}
        <motion.section
          variants={itemVariants}
          className="w-full flex flex-col md:flex-row gap-10 items-stretch justify-center font-regular"
        >
          <ScarCard
            title="Keloid Scar"
            tagText="AGGRESSIVE GROWTH"
            tagColor="red"
            imageSrc={keloidImage}
            description="Characterized by dense fibrous tissue that extends beyond the borders of the original injury. Commonly features claw-like extensions and constant growth."
            checklistItems={keloidChecklist}
          />
          <ScarCard
            title="Hypertrophic Scar"
            tagText="STABILIZED GROWTH"
            tagColor="blue"
            imageSrc={hypertrophicImage}
            description="Remains within the original wound boundaries. Often develops rapidly after surgery and may regress spontaneously over a period of 6-24 months."
            checklistItems={hypertrophicChecklist}
          />
        </motion.section>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full flex flex-col items-center"
      >
        {/* 3. Section "How SCARE Works" */}
        <motion.section
          variants={itemVariants}
          className="w-full max-w-5xl mx-auto mt-26 mb-16 px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#00687B]">
              How SCARE Works
            </h2>
            <p className="text-[#545454] mt-3 text-xl font-normal md:text-base max-w-2xl mx-auto">
              Our Clinical Decision Support System is designed for seamless
              integration into your daily medical workflow in three simple
              steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center text-[#4DC9E5] mb-6 ">
                <FiUploadCloud size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                1. Upload Image
              </h3>
              <p className="text-[#545454] text-sm leading-relaxed">
                Securely capture and upload a clear clinical photograph of the
                patient's scar tissue directly into the platform.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center text-[#4DC9E5] mb-6 ">
                <FiCpu size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2. AI Processing
              </h3>
              <p className="text-[#545454] text-sm leading-relaxed">
                Our advanced deep learning model analyzes the visual
                characteristics of the scar with high precision in seconds.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center text-[#4DC9E5] mb-6 ">
                <FiCheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3. Objective Result
              </h3>
              <p className="text-[#545454] text-sm leading-relaxed">
                Receive a standardized classification (Keloid or Hypertrophic)
                to support your clinical decision and prevent surgical errors.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 4. Final CTA Button */}
        <motion.section
          variants={itemVariants}
          className="w-full max-w-3xl mx-auto mt-10 px-4 text-center mb-10"
        >
          <Link
            to="/analysis"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] text-white text-xl font-medium px-16 py-5 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-[#4DC9E5]/60 hover:brightness-110 active:scale-95 active:translate-y-0 active:shadow-md cursor-pointer"
          >
            Start Analysis
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </motion.section>
      </motion.div>
    </main>
  );
}
