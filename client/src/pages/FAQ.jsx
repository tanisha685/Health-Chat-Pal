import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const HealthLiteracy = () => {
  const heroRef = useRef(null);
  const quizRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, threshold: 0.3 });
  const quizInView = useInView(quizRef, { once: true, threshold: 0.2 });

  /* -------------------------------------------------------
     📘 HEALTH AWARENESS LEARNING CONTENT
  --------------------------------------------------------*/
  const literacySections = [
    {
      title: "Understanding Symptoms",
      icon: "🩺",
      text: "Many symptoms such as fever, cough, body aches, or fatigue can be caused by multiple conditions—not only infections. Knowing your symptoms helps you make informed decisions and know when to seek medical care."
    },
    {
      title: "Disease Prevention Basics",
      icon: "🛡️",
      text: "Simple habits such as handwashing, mask usage in polluted areas, staying hydrated, and maintaining hygiene reduce risks of common infections and respiratory problems."
    },
    {
      title: "Emergency Warning Signs",
      icon: "⚠️",
      text: "Breathing difficulty, chest pain, confusion, severe dehydration, seizures, uncontrolled bleeding, or persistent high fever require IMMEDIATE medical attention."
    },
    {
      title: "Mental Health Awareness",
      icon: "🧠",
      text: "Mental health is just as important as physical health. Early signs like persistent sadness, anxiety, or withdrawal should not be ignored. Talking to a professional helps."
    },
    {
      title: "Medication Safety",
      icon: "💊",
      text: "Never self-prescribe antibiotics, steroids, or high-dose painkillers. Misuse can cause dangerous side effects or antibiotic resistance."
    },
    {
      title: "Healthy Lifestyle",
      icon: "🍎",
      text: "Regular exercise, balanced diet, 7-9 hours of sleep, and limiting screen time significantly reduce the risk of lifestyle diseases."
    }
  ];

  /* -------------------------------------------------------
     📝 QUIZ QUESTIONS (15 QUESTIONS)
  --------------------------------------------------------*/
  const quizQuestions = [
    {
      q: "How long should you wash your hands to effectively remove germs?",
      options: ["5 seconds", "10 seconds", "20 seconds", "1 minute"],
      answer: "20 seconds"
    },
    {
      q: "A fever becomes medically concerning at or above:",
      options: ["99°F", "100°F", "101°F", "103°F"],
      answer: "103°F"
    },
    {
      q: "What should you do if someone is having chest pain?",
      options: ["Give water", "Tell them to rest", "Call emergency services immediately", "Wait for 1 hour"],
      answer: "Call emergency services immediately"
    },
    {
      q: "Which vitamin is essential for strong immunity?",
      options: ["Vitamin C", "Vitamin K", "Vitamin B12", "Vitamin A"],
      answer: "Vitamin C"
    },
    {
      q: "What is the healthiest amount of daily sleep for adults?",
      options: ["4–5 hours", "6–7 hours", "7–9 hours", "10–12 hours"],
      answer: "7–9 hours"
    },
    {
      q: "Which habit reduces the spread of infections the MOST?",
      options: ["Wearing expensive masks", "Using antibiotics unnecessarily", "Handwashing regularly", "Eating spicy foods"],
      answer: "Handwashing regularly"
    },
    {
      q: "If someone faints, what should you do first?",
      options: ["Shake them forcefully", "Give them food", "Check breathing & call help", "Ignore it"],
      answer: "Check breathing & call help"
    },
    {
      q: "A balanced diet should include:",
      options: ["Only protein", "Only fat", "Only carbohydrates", "A mix of all nutrients"],
      answer: "A mix of all nutrients"
    },
    {
      q: "What is a common early symptom of dehydration?",
      options: ["Runny nose", "Muscle tension", "Dry mouth & dizziness", "Sneezing"],
      answer: "Dry mouth & dizziness"
    },
    {
      q: "Which is healthier?",
      options: ["Sugary drinks", "Energy drinks", "Water", "Fried juices"],
      answer: "Water"
    },
    {
      q: "Which organ does smoking damage MOST?",
      options: ["Stomach", "Heart & lungs", "Skin", "Eyes"],
      answer: "Heart & lungs"
    },
    {
      q: "What should you do during high air pollution?",
      options: ["Go for outdoor runs", "Keep windows open", "Wear N95 mask outdoors", "Spray perfume"],
      answer: "Wear N95 mask outdoors"
    },
    {
      q: "Which is a sign of mental stress?",
      options: ["Hunger", "Hair growth", "Anxiety & irritability", "Sneezing"],
      answer: "Anxiety & irritability"
    },
    {
      q: "Self-prescribing antibiotics is dangerous because:",
      options: [
        "They taste bad",
        "They cause addiction",
        "They can cause antibiotic resistance",
        "Doctors get angry"
      ],
      answer: "They can cause antibiotic resistance"
    },
    {
      q: "The best way to maintain long-term health is:",
      options: ["Crash dieting", "Starving", "Balanced diet + exercise", "Eating only fruits"],
      answer: "Balanced diet + exercise"
    }
  ];

  /* -------------------------------------------------------
     🎯 QUIZ STATE
  --------------------------------------------------------*/
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option) => {
    setSelected(option);

    if (option === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setFinished(true);
      }
      setSelected(null);
    }, 800);
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setSelected(null);
    setFinished(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden font-inter">

      {/* SOFT BACKGROUND GRADIENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* ---------------------------------------------------
            HERO HEADER
      --------------------------------------------------- */}
      <motion.header
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="relative z-10 pt-20 sm:pt-32 pb-12 sm:pb-24 px-4 sm:px-6 text-center"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          >
            Health Literacy &  
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Quiz Module
            </span>
          </motion.h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Boost your health awareness with simple learning sections  
            and test your knowledge with our interactive quiz!
          </p>
        </div>
      </motion.header>

      {/* ---------------------------------------------------
            HEALTH AWARENESS SECTIONS
      --------------------------------------------------- */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="space-y-8">
          {literacySections.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">{item.icon}</span>
                <h2 className="text-2xl font-bold text-slate-900">
                  {item.title}
                </h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* ---------------------------------------------------
                QUIZ START
        --------------------------------------------------- */}
        <motion.div
          ref={quizRef}
          initial={{ opacity: 0, y: 40 }}
          animate={quizInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-6">
            📝 Health Awareness Quiz
          </h2>

          {!finished ? (
            <>
              <p className="text-slate-700 text-center text-lg mb-8">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </p>

              <motion.h3
                key={currentQuestion}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-center mb-8"
              >
                {quizQuestions[currentQuestion].q}
              </motion.h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizQuestions[currentQuestion].options.map((opt, idx) => {
                  const isCorrect = opt === quizQuestions[currentQuestion].answer;
                  const isSelected = selected === opt;

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(opt)}
                      className={`px-6 py-4 rounded-xl border text-left transition-all text-lg font-medium
                        ${
                          selected
                            ? isCorrect
                              ? "bg-green-100 border-green-400 text-green-700"
                              : isSelected
                              ? "bg-red-100 border-red-400 text-red-700"
                              : "bg-white border-slate-200"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }
                      `}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-4xl font-bold mb-4">
                🎉 Your Score: {score}/{quizQuestions.length}
              </h3>

              <p className="text-xl text-slate-700 mb-6">
                {score >= 13
                  ? "Excellent health awareness! 🌟"
                  : score >= 9
                  ? "Good job! Keep learning! 💡"
                  : "Needs improvement — learn & retry! 📘"}
              </p>

              <button
                onClick={restartQuiz}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg"
              >
                Restart Quiz
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HealthLiteracy;
