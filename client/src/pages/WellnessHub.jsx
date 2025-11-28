import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import BMICalculator from '../components/WellnessHubComponents/BMICalculator';
import CalorieCalculator from '../components/WellnessHubComponents/CalorieCalculator';
import HeartRateCalculator from '../components/WellnessHubComponents/HeartRateCalculator';
import WaterIntakeCalculator from '../components/WellnessHubComponents/WaterIntakeCalculator';
import SleepCalculator from '../components/WellnessHubComponents/SleepCalculator';
import ProteinCalculator from '../components/WellnessHubComponents/ProteinCalculator';
import MacroCalculator from '../components/WellnessHubComponents/MacroCalculator';
import VO2MaxCalculator from '../components/WellnessHubComponents/VO2MaxCalculator';
import BSACalculator from '../components/WellnessHubComponents/BSACalculator';
import CaffeineCalculator from '../components/WellnessHubComponents/CaffeineCalculator';
import OneRepMaxCalculator from '../components/WellnessHubComponents/OneRepMaxCalculator';
import RunningPaceCalculator from '../components/WellnessHubComponents/RunningPaceCalculator';
import BodyFatCalculator from '../components/WellnessHubComponents/BodyFatCalculator';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};
const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
};

const WellnessHub = () => {
    const headerRef = useRef(null);
    const gridRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true, threshold: 0.5 });
    const gridInView = useInView(gridRef, { once: true, threshold: 0.1 });

    // USER DATA POPUP STATE
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem("wellnessUser");
        return saved ? JSON.parse(saved) : null;
    });

    const [form, setForm] = useState({
        age: "",
        gender: "",
        weight: "",
        height: ""
    });

    const handleSubmit = () => {
        if (!form.age || !form.gender || !form.weight || !form.height)
            return alert("Please fill all fields");

        localStorage.setItem("wellnessUser", JSON.stringify(form));
        setUserData(form);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800 overflow-x-hidden">

            {/* ⭐ USER DATA POPUP (Correct Location) */}
            {!userData && (
                <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                            Tell Us About You 🧍‍♂️🧍‍♀️
                        </h2>

                        <p className="text-slate-600 text-center mb-6">
                            We will personalize your wellness calculations.
                        </p>

                        <div className="space-y-4">
                            <input
                                className="w-full p-3 border rounded-xl"
                                placeholder="Age"
                                type="number"
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: e.target.value })}
                            />

                            <select
                                className="w-full p-3 border rounded-xl"
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            <input
                                className="w-full p-3 border rounded-xl"
                                placeholder="Weight (kg)"
                                type="number"
                                value={form.weight}
                                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                            />

                            <input
                                className="w-full p-3 border rounded-xl"
                                placeholder="Height (cm)"
                                type="number"
                                value={form.height}
                                onChange={(e) => setForm({ ...form, height: e.target.value })}
                            />

                            <button
                                className="mt-4 w-full bg-teal-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition"
                                onClick={handleSubmit}
                            >
                                Continue →
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-teal-100/40 to-emerald-100/40 rounded-full blur-2xl"></div>
                <div className="absolute top-1/3 left-10 w-48 h-48 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-100/25 to-purple-100/25 rounded-full blur-3xl"></div>
            </div>

            {/* HEADER SECTION */}
            <motion.header
                ref={headerRef}
                initial={{ opacity: 0, y: 30 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1 }}
                className="relative z-10 pt-20 pb-16 px-6 text-center"
            >
                <h1 className="text-5xl font-extrabold">
                    <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        Wellness Hub
                    </span>
                </h1>

                <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
                    Personalized, medical-grade calculations to optimize your daily health.
                </p>
            </motion.header>

            {/* CALCULATOR GRID */}
            <div className="relative z-10 max-w-7xl mx-auto py-12 px-6">
                <motion.div
                    ref={gridRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={gridInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    {/* PASS userData TO EVERY COMPONENT */}
                    <motion.div variants={itemVariants}><BMICalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><CalorieCalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><HeartRateCalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><WaterIntakeCalculator user={userData} /></motion.div>

                    <motion.div variants={itemVariants}><SleepCalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><ProteinCalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><MacroCalculator user={userData} /></motion.div>

                    <motion.div variants={itemVariants}><VO2MaxCalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><BSACalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><CaffeineCalculator user={userData} /></motion.div>

                    <motion.div variants={itemVariants}><OneRepMaxCalculator user={userData} /></motion.div>
                    <motion.div variants={itemVariants}><RunningPaceCalculator user={userData} /></motion.div>

                    <motion.div variants={itemVariants} className="col-span-full">
                        <BodyFatCalculator user={userData} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default WellnessHub;
