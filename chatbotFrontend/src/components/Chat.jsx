import { useContext, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { BiMicrophone } from "react-icons/bi";
import { IoStopCircleOutline } from "react-icons/io5";
import { GiTalk } from "react-icons/gi";
import { RiSpeakFill } from "react-icons/ri";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { MdClear, MdDelete } from "react-icons/md";
import { UserContext } from "../Context/userContext";
import NavSider from "./NavSider";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [processingVoice, setProcessingVoice] = useState(false);
  const { user } = useContext(UserContext);
  const chatEndRef = useRef(null);
  const speechRef = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Initialize speech synthesis
  useEffect(() => {
    speechRef.current = new SpeechSynthesisUtterance();
    speechRef.current.rate = 1;
    speechRef.current.pitch = 1;
    speechRef.current.volume = 1;

    return () => {
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);
   console.log(user)
  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/get_history?user_id=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedMessages = data.messages.map((msg) => ({
            text: msg.content,
            sender: msg.role === "user" ? "user" : "bot",
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };
    
    loadHistory();
  }, [user.id]);

  // Start continuous listening
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  // Stop listening
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  // Stop speech synthesis
  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Clear transcript
  const clearTranscript = () => {
    resetTranscript();
    setInput("");
  };

  // Send message function
  const handleSend = async (textToSend = null) => {
    const messageText = textToSend || input.trim();
    if (!messageText) return;

    const userMsg = { text: messageText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    resetTranscript();
    setLoading(true);
    setProcessingVoice(true);

    try {
      const formData = new URLSearchParams();
      formData.append("msg", messageText);
      formData.append("userId", user.id);

      const response = await fetch("http://127.0.0.1:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const botMsg = { text: data.answer || "No response", sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);

      // Speak the response if auto-speak is enabled
      if (autoSpeak && mode === "talk") {
        speakText(botMsg.text);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = {
        text: "Something went wrong. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);

      if (autoSpeak && mode === "talk") {
        speakText(errorMsg.text);
      }
    } finally {
      setLoading(false);
      setProcessingVoice(false);
    }
  };

  // Text to speech function
const speakText = (text) => {
  if (!speechRef.current) return;
  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
  speechSynthesis.cancel();
  speechRef.current.text = text;
  speechRef.current.voice = selectedVoice;
  speechSynthesis.speak(speechRef.current);
};

  // Handle voice send in talk mode
  const handleVoiceSend = () => {
    if (transcript.trim()) {
      stopListening();
      handleSend(transcript);
    }
  };

  // Clear all messages
  const clearAllMessages = async () => {
    try {
      await fetch("http://127.0.0.1:8080/clear_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear history:", error);
      setMessages([]);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg text-red-600 font-semibold mb-2">
            Browser Not Supported
          </p>
          <p className="text-gray-600">
            Please use Chrome, Edge, or Safari for voice features.
          </p>
        </div>
      </div>
    );
  }

  return mode === "chat" ? (
    // ==================== CHAT MODE ====================
    <div className="w-full h-screen flex items-center  ">
      <NavSider />

      <div className="w-[70vw]  h-[70vh] flex items-center justify-center  ">
        <div className="w-full max-w-4xl h-[95vh] p-5 bg-white shadow-xl  flex flex-col rounded-3xl border border-gray-200">
          {/* Header */}
          <div className="bg-black p-4 flex shadow-xl items-center justify-between rounded-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <GiTalk color="black" size={24} />
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">
                  Cancer Assistant
                </h1>
                <p className="text-blue-100 text-xs">Chat Mode</p>
              </div>
            </div>

            <div className="flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearAllMessages}
                  className="bg-white/20 hover:bg-white/30 w-10 h-10 flex items-center justify-center rounded-lg"
                  title="Clear chat"
                >
                  <MdDelete color="white" size={20} />
                </button>
              )}
              <button
                onClick={() => setMode("talk")}
                className="bg-white hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-lg"
                title="Switch to voice mode"
              >
                <RiSpeakFill color="black" size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 rounded-3xl mt-2 ">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <GiTalk color="white" size={40} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Start Chatting
                  </h2>
                  <p className="text-gray-600">
                    Ask me anything about cancer and health!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-gray-700 text-xs font-bold">
                        AI
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-black text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center ml-2 flex-shrink-0">
                      <span className="text-white text-xs font-bold">ME</span>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Area */}
          <div className="p-2 bg-black mt-2 rounded-3xl shadow-2xl  border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-12 bg-black text-white rounded-lg px-4 pr-10 outline-none  "
                  placeholder="Type your message..."
                  onKeyDown={(e) =>
                    e.key === "Enter" && !loading && handleSend()
                  }
                  disabled={loading}
                />
                {input && (
                  <button
                    onClick={() => setInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <MdClear size={18} />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="w-12 h-12 flex items-center justify-center bg-black rounded-lg">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <button
                  className="w-12 h-12 bg-black 0 rounded-lg flex items-center justify-center  disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                >
                  <FiSend size={20} color="white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // ==================== VOICE MODE ====================
    <div className="w-full h-screen flex items-center">
      <NavSider />

      <div className="w-[70vw] h-[70vh] flex items-center justify-center ">
        <div className="w-full max-w-4xl p-5 h-[95vh]  bg-white shadow-lg flex flex-col rounded-3xl border border-gray-200">
          {/* Header */}
          <div className="bg-black p-4 rounded-3xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <RiSpeakFill color="black" size={24} />
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">
                  Cancer Assistant
                </h1>
                <p className="text-purple-100 text-xs">
                  Voice Mode - {listening ? "Listening" : "Ready"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 ">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`${
                  autoSpeak ? "bg-white/30" : "bg-white/10"
                } hover:bg-white/40 w-10 h-10 flex items-center justify-center rounded-lg`}
                title={autoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
              >
                {autoSpeak ? (
                  <HiVolumeUp color="white" size={20} />
                ) : (
                  <HiVolumeOff color="white" size={20} />
                )}
              </button>
              <button
                onClick={() => setMode("chat")}
                className="bg-white hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-lg"
                title="Switch to chat mode"
              >
                <GiTalk color="black" size={20} />
              </button>
            </div>
          </div>

          {/* Voice Interface */}
          <div className="flex-1 flex flex-col  items-center justify-center p-6 overflow-y-auto">
            {/* Listening Animation */}
            <div className="mb-8 relative mt-20">
              <div
                className={`w-40 h-40 rounded-full mt-10 flex items-center justify-center bg-black`}
              >
                <BiMicrophone size={listening ? 70 : 60} color="white" />
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-white shadow-md border border-gray-200">
                <p className="text-xs font-semibold text-gray-700">
                  {listening
                    ? "Recording"
                    : processingVoice
                    ? "Processing"
                    : isSpeaking
                    ? "Speaking"
                    : "Idle"}
                </p>
              </div>
            </div>

            {/* Transcript Display */}
            <div className="w-full max-w-2xl mb-8 relative">
              <div className="bg-gray-100 rounded-lg p-6 border border-gray-200 min-h-[150px] max-h-[250px] overflow-y-auto">
                {transcript ? (
                  <p className="text-gray-800 text-base leading-relaxed">
                    {transcript}
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <BiMicrophone size={36} className="text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      Start speaking and your words will appear here...
                    </p>
                  </div>
                )}
              </div>

              {transcript && (
                <button
                  onClick={clearTranscript}
                  className="absolute top-3 right-3 w-8 h-8 bg-black hover:bg-slate-900 rounded-full flex items-center justify-center"
                  title="Clear transcript"
                >
                  <MdClear color="white" size={18} />
                </button>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-6 items-center mb-6">
              {!listening ? (
                <button
                  onClick={startListening}
                  disabled={processingVoice || isSpeaking}
                  className="w-16 h-16 bg-black hover:bg-slate-900 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Start listening"
                >
                  <BiMicrophone size={32} color="white" />
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="w-16 h-16 bg-black hover:bg-slate-900 rounded-lg flex items-center justify-center"
                  title="Stop listening"
                >
                  <IoStopCircleOutline size={32} color="white" />
                </button>
              )}

              {transcript && !listening && (
                <button
                  onClick={handleVoiceSend}
                  disabled={loading || processingVoice}
                  className="w-16 h-16 bg-black  rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <FiSend size={28} color="white" />
                </button>
              )}

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center"
                  title="Stop speaking"
                >
                  <HiVolumeOff size={32} color="white" />
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm">
                {listening
                  ? "Listening to your voice... Click stop when done"
                  : transcript
                  ? "Click the send button to submit your message"
                  : "Click the microphone to start voice input"}
              </p>
            </div>

            {/* Recent Conversation */}
            {messages.length > 0 && (
              <div className="w-full max-w-2xl">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Recent Conversation
                    </p>
                    <button
                      onClick={clearAllMessages}
                      
                      title="Clear all"
                    >
                      <MdDelete size={18} color="black" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {messages.slice(-3).map((msg, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.sender === "user"
                              ? "bg-black"
                              : "bg-gray-400"
                          }`}
                        >
                          <span className="text-white text-xs font-bold">
                            {msg.sender === "user" ? "U" : "AI"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
