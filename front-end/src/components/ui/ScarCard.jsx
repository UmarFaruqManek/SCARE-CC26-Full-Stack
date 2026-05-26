import React from "react";
import ChecklistItem from "./ChecklistItem";

export default function ScarCard({
  title,
  tagText,
  tagColor,
  imageSrc,
  description,
  checklistItems,
}) {
  const tagColors = {
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-sky-100 text-sky-700 border-sky-200",
  };

  return (
    /* DITAMBAHKAN: transition-all, duration-300, ease-in-out, hover:-translate-y-2, hover:shadow-2xl */
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-xl flex-1 flex flex-col">
      <header className="text-center mb-8">
        {/* Gunakan ukuran teks yang sudah Anda sesuaikan sebelumnya, di sini saya gunakan default */}
        <h3 className="text-4xl font-bold text-gray-900">{title}</h3>
        <span
          className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${tagColors[tagColor]}`}
        >
          {tagText}
        </span>
      </header>

      {/* Gambar otomatis membesar karena mengikuti lebar parent (max-w-xl) */}
      <div className="aspect-video rounded-xl overflow-hidden mb-8 border border-gray-100 bg-gray-50 flex items-center justify-center">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={`Ilustrasi ${title}`} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-xs text-gray-400">Gambar {title}</span>
        )}
      </div>

      <p className="text-[#545454] text-sm leading-relaxed mb-8 flex-grow">
        {description}
      </p>

      {/* Checklist Grid */}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
        {checklistItems.map((item, index) => (
          <ChecklistItem key={index} text={item} />
        ))}
      </ul>
    </div>
  );
}