import { useEffect, useState } from "react";

const BMICalculator = ({ user }) => {
    const [height, setHeight] = useState(user?.height || 170);
    const [weight, setWeight] = useState(user?.weight || 70);
    const [bmi, setBmi] = useState(0);
    const [category, setCategory] = useState("");

    useEffect(() => {
        const h = height / 100;
        const b = Number((weight / (h * h)).toFixed(1));
        setBmi(b);

        if (b < 18.5) setCategory("Underweight");
        else if (b <= 24.9) setCategory("Normal weight");
        else if (b <= 29.9) setCategory("Overweight");
        else setCategory("Obesity");
    }, [height, weight]);

    const rotation = () => {
        const val = Math.max(10, Math.min(40, bmi));
        return (val - 10) / 30 * 180 - 90;
    };

    const bmiColor = {
        Underweight: "text-amber-600",
        "Normal weight": "text-emerald-600",
        Overweight: "text-orange-600",
        Obesity: "text-red-600"
    }[category];

    return (
        <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 w-full h-80 overflow-hidden">

            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500 pointer-events-none"></div>

            {/* SCROLLABLE CONTENT */}
            <div className="relative z-10 h-full overflow-y-auto pr-2 custom-scrollbar">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        📏
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800">BMI Calculator</h3>
                        <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                            Body Mass Index
                        </span>
                    </div>
                </div>

                {/* Gauge */}
                <div className="relative h-20 flex justify-center mb-4">
                    <div className="relative w-36 h-18">

                        {/* Border semi-circle */}
                        <div className="absolute bottom-0 left-0 w-full h-full border-4 border-slate-300 rounded-t-full border-b-0"></div>

                        {/* Colored ranges */}
                        <div className="absolute bottom-0 left-0 w-full h-full rounded-t-full overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-1/4 h-full bg-amber-400/40"></div>
                            <div className="absolute bottom-0 left-1/4 w-1/4 h-full bg-emerald-400/40"></div>
                            <div className="absolute bottom-0 left-2/4 w-1/4 h-full bg-orange-400/40"></div>
                            <div className="absolute bottom-0 left-3/4 w-1/4 h-full bg-red-500/40"></div>
                        </div>

                        {/* Needle */}
                        <div
                            className="absolute bottom-0 left-1/2 w-1 h-4 bg-slate-800 rounded-full transition-transform duration-700"
                            style={{ transform: `translateX(-50%) rotate(${rotation()}deg) translateY(-3rem)` }}
                        ></div>

                        <div className="absolute bottom-1 left-1/2 w-4 h-4 bg-slate-700 rounded-full -translate-x-1/2"></div>
                    </div>
                </div>

                {/* Results */}
                <div className="text-center mb-4">
                    <p className="text-3xl font-black text-slate-800">{bmi}</p>
                    <p className={`text-sm font-bold ${bmiColor}`}>{category}</p>
                </div>

                {/* HEIGHT */}
                <div className="mb-5">
                    <label className="text-xs font-medium text-slate-600">Height (cm)</label>
                    <input
                        type="number"
                        className="w-full p-2 mt-1 border rounded-lg mb-2"
                        min="120" max="220"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                    />

                    <div className="flex items-center gap-3">
                        <button 
                            className="px-3 py-1 bg-slate-200 rounded-lg"
                            onClick={() => setHeight(h => Math.max(120, h - 1))}
                        >–</button>

                        <input
                            type="range"
                            min="120"
                            max="220"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full"
                        />

                        <button 
                            className="px-3 py-1 bg-slate-200 rounded-lg"
                            onClick={() => setHeight(h => Math.min(220, h + 1))}
                        >+</button>
                    </div>
                </div>

                {/* WEIGHT */}
                <div className="mb-5">
                    <label className="text-xs font-medium text-slate-600">Weight (kg)</label>
                    <input
                        type="number"
                        className="w-full p-2 mt-1 border rounded-lg mb-2"
                        min="40" max="150"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                    />

                    <div className="flex items-center gap-3">
                        <button 
                            className="px-3 py-1 bg-slate-200 rounded-lg"
                            onClick={() => setWeight(w => Math.max(40, w - 1))}
                        >–</button>

                        <input
                            type="range"
                            min="40"
                            max="150"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full"
                        />

                        <button 
                            className="px-3 py-1 bg-slate-200 rounded-lg"
                            onClick={() => setWeight(w => Math.min(150, w + 1))}
                        >+</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BMICalculator;
