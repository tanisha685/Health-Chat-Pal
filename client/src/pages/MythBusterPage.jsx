import React, { useState } from "react";
import myths from "../data/myths.json";
import { motion } from "framer-motion";

const MythBusterPage = () => {
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 px-4 py-10">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold text-slate-800">
          Myth Buster 🔍  
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Breaking popular Indian health myths — scientifically, in English & Hindi.
        </p>

        {/* Language Toggle */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all ${
              language === "en"
                ? "bg-teal-600 text-white border-teal-600"
                : "border-slate-400 text-slate-600"
            }`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>

          <button
            className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all ${
              language === "hi"
                ? "bg-teal-600 text-white border-teal-600"
                : "border-slate-400 text-slate-600"
            }`}
            onClick={() => setLanguage("hi")}
          >
            हिंदी
          </button>
        </div>
      </motion.div>

      {/* Myth Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {myths.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all"
          >
            {/* Category Tag */}
            <span className="px-3 py-1 text-xs font-semibold bg-teal-100 text-teal-700 rounded-full">
              {item.category}
            </span>

            {/* Myth Title */}
            <h2 className="mt-4 text-lg font-bold text-red-600 flex items-center">
              ❌ {language === "en" ? item.myth : item.hindiMyth}
            </h2>

            {/* Fact */}
            <p className="mt-3 text-green-700 text-sm flex items-start leading-relaxed">
              <span className="mr-2 text-lg">✔</span>
              {language === "en" ? item.fact : item.hindiFact}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default MythBusterPage;
