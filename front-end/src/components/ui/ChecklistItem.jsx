import React from "react";

export default function ChecklistItem({ text }) {
  return (
    <li className="flex items-center gap-3">
      {/* Ini adalah kotak untuk ikon centangnya saja */}
      <div className="flex items-center justify-center w-6 h-6 border-3 border-[#00687B] bg-white rounded flex-shrink-0">
        <svg
          className="w-4 h-4 text-[#00687B]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3" /* Saya pertebal sedikit centangnya (dari 2 ke 3) agar lebih jelas */
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      
      {/* Teks berada di luar kotak */}
      <span className="text-[#545454]  text-sm">{text}</span>
    </li>
  );
}