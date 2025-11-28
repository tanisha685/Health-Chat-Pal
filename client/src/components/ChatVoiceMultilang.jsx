// client/src/components/ChatVoiceMultilang.jsx
import React, { useState, useRef, useEffect } from "react";

/**
 * Props:
 *  - onSend(text: string)               // required: called when user presses Send
 *  - backendUrl: string                 // optional (not used directly here, kept for future)
 *  - defaultUserLang: string (e.g. "en-IN" or "hi-IN")
 */

const LIBRETRANSLATE_URL = "https://libretranslate.de/translate"; // swap if self-hosting

async function translateText(text, source, target) {
  if (!text) return "";
  if (!source || source === target) return text;
  try {
    const res = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source, target, format: "text" }),
    });
    if (!res.ok) {
      console.warn("Translate failed:", res.statusText);
      return text;
    }
    const data = await res.json();
    return data.translatedText ?? text;
  } catch (err) {
    console.warn("Translate error:", err);
    return text;
  }
}

function pickLocaleForLang(lang) {
  // ensure language codes are in the form "en", "hi", "bn" etc.
  if (!lang) return "en-US";
  // map common ones to a full locale where helpful
  const map = {
    en: "en-US",
    hi: "hi-IN",
    bn: "bn-IN",
    ta: "ta-IN",
    te: "te-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    pa: "pa-IN",
    or: "or-IN",
    ur: "ur-IN",
    as: "as-IN"
  };
  return map[lang.split("-")[0]] || (lang.includes("-") ? lang : `${lang}-IN`);
}

export default function ChatVoiceMultilang({
  onSend,
  backendUrl = "",
  defaultUserLang = "en-IN"
}) {
  const [userLang, setUserLang] = useState(defaultUserLang);
  const [recognizing, setRecognizing] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [input, setInput] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // pre-load voices (helps some browsers)
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  function ensureRecognition() {
    if (recognitionRef.current) return recognitionRef.current;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const r = new SpeechRecognition();
    r.lang = userLang;
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
      const txt = ev.results[0][0].transcript;
      // append to existing input (user may have typed something)
      setInput(prev => (prev ? prev + " " + txt : txt));
    };
    r.onend = () => setRecognizing(false);
    r.onerror = (e) => {
      console.warn("Speech recognition error", e);
      setRecognizing(false);
    };
    recognitionRef.current = r;
    return r;
  }

  const startStopMic = () => {
    const r = ensureRecognition();
    if (!r) {
      alert("Speech recognition not available in this browser. Use Chrome/Edge on desktop or supported mobile browsers.");
      return;
    }
    if (recognizing) {
      r.stop();
      setRecognizing(false);
      return;
    }
    r.lang = userLang;
    try {
      r.start();
      setRecognizing(true);
    } catch (e) {
      console.warn("start error", e);
    }
  };

  // Send flow: if autoTranslate is enabled, translate to English then call onSend
  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput(""); // clear the voice input field immediately

    // If caller provided onSend, call it with original text in user's language.
    // The server expects English by default; but your chatAPI already handles translation or your generator can.
    // Here we call onSend(userText) and let the server handle it (or you can modify to translate here).
    if (onSend) {
      // If you want to translate before sending, uncomment the lines below:
      // const langCode = (userLang || "en").split("-")[0];
      // let sendText = userText;
      // if (langCode !== "en" && autoTranslate) {
      //   sendText = await translateText(userText, langCode, "en");
      // }
      onSend(userText);
    }
  };

  // small helper to read text
  const speakText = (text, lang) => {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = pickLocaleForLang((lang || userLang).split("-")[0]);
    const voices = window.speechSynthesis.getVoices() || [];
    const prefer = voices.find(v => (v.lang || "").toLowerCase().startsWith(utter.lang.split("-")[0]));
    if (prefer) utter.voice = prefer;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // long list of Indian languages and common world languages (add more easily)
  const LANG_OPTIONS = [
    { code: "en-IN", label: "English (en)" },
    { code: "hi-IN", label: "हिन्दी (hi)" },
    { code: "bn-IN", label: "বাংলা (bn)" },
    { code: "ta-IN", label: "தமிழ் (ta)" },
    { code: "te-IN", label: "తెలుగు (te)" },
    { code: "mr-IN", label: "मराठी (mr)" },
    { code: "gu-IN", label: "ગુજરાતી (gu)" },
    { code: "kn-IN", label: "ಕನ್ನಡ (kn)" },
    { code: "ml-IN", label: "മലയാളം (ml)" },
    { code: "pa-IN", label: "ਪੰਜਾਬੀ (pa)" },
    { code: "or-IN", label: "ଓଡ଼ିଆ (or)" },
    { code: "ur-IN", label: "اُردُو (ur)" },
    { code: "as-IN", label: "অসমীয়া (as)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-ES", label: "Español (es)" },
    { code: "fr-FR", label: "Français (fr)" }
  ];

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%" }}>
      <select
        value={userLang}
        onChange={(e) => {
          setUserLang(e.target.value);
          if (recognitionRef.current) recognitionRef.current.lang = e.target.value;
        }}
        aria-label="Select language"
      >
        {LANG_OPTIONS.map(opt => (
          <option key={opt.code} value={opt.code}>{opt.label}</option>
        ))}
      </select>

      <button onClick={startStopMic} aria-label="Start/stop microphone">
        {recognizing ? "Stop Mic" : "🎤 Speak"}
      </button>

      <input
        style={{ flex: 1, padding: 8 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or speak..."
      />

      <button onClick={() => setAutoTranslate(s => !s)} title="Auto translate" aria-label="Auto translate toggle">
        {autoTranslate ? "🔤" : "✖️"}
      </button>

      <button onClick={handleSend} aria-label="Send captured text">Send</button>

      <button onClick={() => { speakText(input, userLang); }} title="Preview TTS">🔊</button>
      <button onClick={stopSpeaking} title="Stop TTS">⏹</button>
    </div>
  );
}
