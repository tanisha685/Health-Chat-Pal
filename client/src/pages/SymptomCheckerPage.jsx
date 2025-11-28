import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "../components/SymptomCheckerComponents/ChatWindow";
import ChatInput from "../components/SymptomCheckerComponents/ChatInput";
import ChatVoiceMultilang from "../components/ChatVoiceMultilang";

import { chatAPI } from "../api/ChatAPI";

const SymptomCheckerPage = () => {

  /* -------------------------------------------------------
     🦠 OUTBREAK ALERT HOOK (MUST BE INSIDE COMPONENT)
  --------------------------------------------------------*/
  const [outbreak, setOutbreak] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/outbreak-alert?lat=${lat}&lon=${lon}`
          );

          const data = await res.json();
          setOutbreak(data.alert || null);
        } catch (err) {
          console.error("Outbreak API error:", err);
        }
      });
    }
  }, []);

  /* -------------------------------------------------------
     💬 CHAT HOOKS
  --------------------------------------------------------*/
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    hasSession: false,
    sessionId: null
  });
  const [conversationStarted, setConversationStarted] = useState(false);

  // Speech synthesis ref
  const synthRef = useRef(window.speechSynthesis);

  /* -------------------------------------------------------
     🚀 INITIAL LOAD
  --------------------------------------------------------*/
  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      const currentSessionInfo = chatAPI.getSessionInfo();
      setSessionInfo(currentSessionInfo);

      if (currentSessionInfo.hasSession) {
        const isActive = await chatAPI.isSessionActive();

        if (isActive) {
          const history = await chatAPI.getConversationHistory();

          if (history?.length > 0) {
            const formatted = history.map((msg, i) => ({
              id: i + 1,
              text: msg.content,
              sender: msg.role === "user" ? "user" : "bot",
              timestamp: new Date(msg.timestamp),
              hasContext: msg.metadata?.hasContext || false,
              sources: msg.metadata?.sources || []
            }));

            setMessages(formatted);
            setConversationStarted(true);
            return;
          }
        }

        // Session exists but expired
        chatAPI.resetSession();
        setSessionInfo({ hasSession: false, sessionId: null });
      }

      showWelcomeMessage();
    } catch (err) {
      console.error(err);
      showWelcomeMessage();
    }
  };

  const showWelcomeMessage = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Hello! I'm Health ChatPal 🏥 Your AI health assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date()
      }
    ]);
  };

  /* -------------------------------------------------------
     📤 SEND USER MESSAGE
  --------------------------------------------------------*/
  const handleSendMessage = async (text) => {
    const userMsg = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await chatAPI.sendMessage(text);

      const botMsg = {
        id: Date.now() + 1,
        text: result.response,
        sender: "bot",
        timestamp: new Date(),
        hasContext: result.hasContext || false,
        sources: result.sources || []
      };

      setMessages((prev) => [...prev, botMsg]);
      setConversationStarted(true);

    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "❗ Sorry, something went wrong. Try again.",
          sender: "bot",
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------
     🔄 NEW CHAT
  --------------------------------------------------------*/
  const handleNewConversation = async () => {
    setIsLoading(true);
    await chatAPI.startNewConversation();

    setSessionInfo(chatAPI.getSessionInfo());
    setMessages([]);
    setConversationStarted(false);
    showWelcomeMessage();
    setIsLoading(false);
  };

  /* -------------------------------------------------------
     🧹 CLEAR CHAT
  --------------------------------------------------------*/
  const handleClearConversation = async () => {
    setIsLoading(true);
    await chatAPI.clearConversation();

    setMessages([]);
    showWelcomeMessage();
    setConversationStarted(false);
    setIsLoading(false);
  };

  /* -------------------------------------------------------
     🔊 SPEECH SYNTHESIS
  --------------------------------------------------------*/
  const speakMessage = (text, lang = "en-IN") => {
    if (!text) return;

    const synth = synthRef.current;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;

    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang.includes(lang.split("-")[0]));
    if (match) utter.voice = match;

    synth.speak(utter);

    return { stop: () => synth.cancel() };
  };

  /* -------------------------------------------------------
     UI RENDER
  --------------------------------------------------------*/
  return (
    <div className="h-screen bg-gray-50 flex flex-col">

      {/* HEADER BAR */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

          <span className="text-sm text-gray-700">
            {sessionInfo.hasSession
              ? conversationStarted
                ? "Conversation Active"
                : "Ready to Chat"
              : "Starting Session..."}
          </span>

          {sessionInfo.sessionId && (
            <span className="text-xs text-gray-500">
              #{sessionInfo.sessionId.slice(-8)}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {conversationStarted && (
            <button
              onClick={handleClearConversation}
              className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded-lg"
            >
              Clear Chat
            </button>
          )}
          <button
            onClick={handleNewConversation}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* OUTBREAK ALERT (BELOW HEADER) */}
      {outbreak && (
        <div className="bg-red-600 text-white text-center py-3 animate-pulse">
          <strong>⚠️ Outbreak Alert:</strong> {outbreak}
        </div>
      )}

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          sessionInfo={sessionInfo}
          onFeedback={() => {}}
          onSpeak={speakMessage}
          onStopSpeaking={() => synthRef.current.cancel()}
        />

        {/* INPUT AREA */}
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <ChatVoiceMultilang
              onSend={handleSendMessage}
              backendUrl={import.meta.env.VITE_BACKEND_URL}
              defaultUserLang={"en-IN"}
            />

            <ChatInput onSubmit={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
