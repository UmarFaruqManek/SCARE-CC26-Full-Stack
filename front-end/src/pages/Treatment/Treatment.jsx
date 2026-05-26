import React from "react";
import {
  FiRefreshCcw,
  FiFileText,
  FiHome,
  FiCamera,
  FiX,
} from "react-icons/fi";
import { IoAnalytics } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// ==========================================
// DATABASE KLASIFIKASI LUKA (Lookup Table)
// ==========================================
const scarDatabase = {
  Keloid: {
    labelDisplay: "Keloid Scar",
    tagText: "AGGRESSIVE GROWTH",
    tagColorClasses: "bg-red-100/70 border-red-200/60 text-red-600",
    dotColorClasses: "bg-red-500",
    hasPing: true,
    pingColorClasses: "bg-red-400",
    protocols: [
      {
        title: "Corticosteroid Injections",
        desc: "The primary and most frequently recommended treatment. Medication is injected directly into the keloid tissue at regular intervals to reduce its size, flatten the bump, and relieve itching or pain.",
      },
      {
        title: "Cryotherapy",
        desc: "Continuous application of medical-grade silicone to the scarred area. Silicone works by maintaining optimal tissue hydration and regulating collagen production to prevent further abnormal growth.",
      },
      {
        title: "Laser Therapy",
        desc: "The use of targeted laser beams (such as Pulsed Dye Laser) focused on the blood vessels surrounding the keloid. It is highly effective for reducing inflammation, fading redness, and improving scar texture.",
      },
      {
        title: "Surgical Excision",
        desc: "The physical removal of the keloid through surgery. Because surgical trauma can trigger the keloid to grow back larger and more aggressively, this procedure must be strictly followed by adjuvant treatments, such as superficial radiation or corticosteroid injections.",
      },
    ],
  },
  Hypertrophic: {
    labelDisplay: "Hypertrophic Scar",
    tagText: "STABILIZED GROWTH",
    tagColorClasses: "bg-blue-100/70 border-blue-200/60 text-blue-600",
    dotColorClasses: "bg-blue-500",
    hasPing: false,
    pingColorClasses: "hidden",
    protocols: [
      {
        title: "Silicone Gel Sheets",
        desc: "The first-line non-invasive treatment. Silicone sheets hydrate the stratum corneum, reducing capillary activity and collagen production, which helps flatten and fade the scar over time.",
      },
      {
        title: "Pressure Garment Therapy",
        desc: "Application of consistent pressure over the scar area. The physical pressure restricts blood flow and oxygen to the scar tissue, effectively helping to thin out and stabilize the hypertrophic growth.",
      },
      {
        title: "Pulsed Dye Laser (PDL)",
        desc: "Highly effective for hypertrophic scars to target the blood vessels within the scar, significantly reducing the red or purplish discoloration and improving the pliability of the skin.",
      },
      {
        title: "Corticosteroid Injections",
        desc: "Utilized if the scar does not respond adequately to silicone or pressure therapy. It reduces inflammation and slows down collagen synthesis, making the scar softer and flatter.",
      },
    ],
  },
};

export default function Treatment() {
  const navigate = useNavigate();
  const location = useLocation();

  const hasState = location.state && location.state.resultData;
  const { image, resultData } = location.state || {};

  const cardStyle =
    "w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (!hasState) {
    return (
      <div className="w-full py-20 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center min-h-[70vh] relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${cardStyle} max-w-2xl p-12 sm:p-16 flex flex-col items-center text-center z-10`}
        >
          <div className="mb-6 text-[#00687B] flex items-center justify-center">
            <FiX className="w-24 h-24 stroke-[3]" />
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
            No Analysis Data Found
          </h1>

          <p className="text-[#545454] text-lg mb-12 leading-relaxed max-w-lg">
            To view personalized treatment protocols, please complete a scar
            classification analysis first. SCARE uses your analysis results to
            provide medically validated recommendations tailored to your
            specific scar type.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/analysis")}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:brightness-110 text-white font-medium py-5 px-14 text-xl rounded-2xl transition-all shadow-md cursor-pointer"
          >
            <FiCamera className="w-7 h-7" />
            Start Scar Analysis
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const aiLabel = resultData ? resultData.label : "Keloid";
  const activeKey = aiLabel.includes("Hypertrophic")
    ? "Hypertrophic"
    : "Keloid";
  const activeData = scarDatabase[activeKey];

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-12 flex justify-center items-start">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl w-full flex flex-col items-center gap-12"
      >
        {/* --- SECTION 1: DIAGNOSTIC OUTCOME CARD --- */}
        <motion.div
          variants={itemVariants}
          className={`${cardStyle} flex flex-col sm:flex-row gap-8 sm:gap-10 items-center justify-between p-10 sm:p-12`}
        >
          <div className="w-40 h-40 sm:w-32 sm:h-32 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-inner">
            {image ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                src={image}
                alt="Analyzed Scar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              DIAGNOSTIC OUTCOME
            </span>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
              Result: {activeData.labelDisplay}
            </h1>

            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${activeData.tagColorClasses}`}
              >
                <span className="relative w-2 h-2 flex">
                  {activeData.hasPing && (
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeData.pingColorClasses}`}
                    ></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${activeData.dotColorClasses}`}
                  ></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">
                  {activeData.tagText}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100/70 border border-green-200/60 rounded-full text-green-600">
                <IoAnalytics className="w-[18px] h-[18px]" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Accuracy: {resultData ? resultData.accuracy : "97.7%"}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/analysis")}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:brightness-110 text-white font-medium py-3 px-7 text-base rounded-2xl transition-all shadow-md cursor-pointer"
          >
            <FiRefreshCcw className="w-5 h-5" />
            Analysis Again
          </motion.button>
        </motion.div>

        {/* --- SECTION 2: PROTOCOLS TITLE --- */}
        <motion.div
          variants={itemVariants}
          className="w-full flex items-center gap-4 text-[#00687B]"
        >
          <FiFileText className="w-7 h-7 flex-shrink-0" />
          <h2 className="text-3xl font-bold">Recommended Treatment Protocol</h2>
        </motion.div>

        {/* --- SECTION 3: PROTOCOLS LIST --- */}
        <div className="w-full flex flex-col gap-8">
          {activeData.protocols.map((protocol, index) => (
            <motion.div
              variants={itemVariants}
              key={index}
              className={`${cardStyle} p-9`}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {protocol.title}
              </h3>
              <p className="text-[#545454] text-lg leading-relaxed">
                {protocol.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- SECTION 4: BACK TO HOME BUTTON --- */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:brightness-110 text-white font-medium py-4 px-12 text-lg rounded-2xl transition-all shadow-md cursor-pointer mt-8"
        >
          <FiHome className="w-6 h-6" />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
