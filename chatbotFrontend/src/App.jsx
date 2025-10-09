import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { BiMicrophone } from "react-icons/bi";
import { IoStopCircleOutline } from "react-icons/io5";
import { GiTalk } from "react-icons/gi";
import { RiSpeakFill } from "react-icons/ri";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { MdClear, MdDelete } from "react-icons/md";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [mode, setMode] = useState('chat');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [processingVoice, setProcessingVoice] = useState(false);
  
  const chatEndRef = useRef(null);
  const speechRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
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

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start continuous listening
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true,
      language: 'en-US'
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
    setClicked(true);
    setProcessingVoice(true);

    try {
      const formData = new URLSearchParams();
      formData.append("msg", userMsg.text);

      const response = await fetch("http://127.0.0.1:8080/get", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      });

      const data = await response.text();
      const botMsg = { text: data || "No response", sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);

      // Speak the response if auto-speak is enabled
      if (autoSpeak) {
        speakText(botMsg.text);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = { text: "⚠️ Something went wrong. Please try again.", sender: "bot" };
      setMessages((prev) => [...prev, errorMsg]);
      
      if (autoSpeak && mode === 'talk') {
        speakText(errorMsg.text);
      }
    } finally {
      setClicked(false);
      setProcessingVoice(false);
    }
  };
  useEffect(()=>{
    const loadvoices = ()=>{
      const voices = speechSynthesis.getVoices()
      console.log("Voices :",voices)
    }
    speechSynthesis.onvoiceschanged= loadvoices
    loadvoices()
     return () => {
    window.speechSynthesis.onvoiceschanged = null;
  };
  },[])


  // Text to speech function
  const speakText = (text) => {
    if (speechRef.current) {
      const voices = speechSynthesis.getVoices()

      const selectedVoices =  voices[10]


      speechSynthesis.cancel();
      speechRef.current.text = text;
      speechRef.current.voice = selectedVoices
      speechRef.current.lang = selectedVoices.lang;

      speechRef.current.onstart = () => setIsSpeaking(true);
      speechRef.current.onend = () => setIsSpeaking(false);
      speechRef.current.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(speechRef.current);
    }
  };

  // Handle voice send in talk mode
  const handleVoiceSend = () => {
    if (transcript.trim()) {
      stopListening();
      handleSend(transcript);
    }
  };

  // Clear all messages
  const clearAllMessages = () => {
    setMessages([]);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-500 font-semibold mb-2">Browser Not Supported</p>
          <p className="text-gray-600">Please use Chrome, Edge, or Safari for voice features.</p>
        </div>
      </div>
    );
  }

  return mode === "chat" ? (
    // ==================== CHAT MODE ====================
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-[90vw] max-w-6xl h-[90vh] bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden rounded-3xl border border-blue-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <GiTalk color="#4f46e5" size={28} />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-wide">AI Assistant</h1>
              <p className="text-blue-100 text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Chat Mode - Online
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {messages.length > 0 && (
              <button 
                onClick={clearAllMessages}
                className="bg-white/20 hover:bg-white/30 transition-all duration-200 w-11 h-11 flex items-center justify-center rounded-xl backdrop-blur-sm group"
                title="Clear chat"
              >
                <MdDelete color="white" size={22} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
            <button 
              onClick={() => setMode("talk")}
              className="bg-white hover:bg-blue-50 transition-all duration-300 w-11 h-11 flex items-center justify-center rounded-xl shadow-lg group hover:shadow-xl"
              title="Switch to voice mode"
            >
              <RiSpeakFill color="#4f46e5" size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-purple-50/30">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center animate-fadeIn">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:rotate-6 transition-transform">
                  <GiTalk color="white" size={48} />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Start Chatting
                </h2>
                <p className="text-gray-500 text-lg">I'm here to help you with anything!</p>
                <div className="mt-6 flex gap-3 justify-center flex-wrap">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">Ask questions</span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">Get advice</span>
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm">Have fun</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slideIn`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-6 py-4 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ml-3 shadow-md flex-shrink-0">
                    <span className="text-white text-xs font-bold">ME</span>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-14 bg-gray-100 rounded-2xl px-6 pr-12 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700 shadow-inner"
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && !clicked && handleSend()}
                disabled={clicked}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <MdClear size={20} />
                </button>
              )}
            </div>
            
            {clicked ? (
              <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <button
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                onClick={() => handleSend()}
                disabled={!input.trim()}
              >
                <FiSend size={22} color="white" className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    // ==================== VOICE MODE ====================
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="w-[90vw] max-w-5xl h-[90vh] bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden rounded-3xl border border-purple-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <RiSpeakFill color="#c026d3" size={28} />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-wide">AI Assistant</h1>
              <p className="text-purple-100 text-xs flex items-center gap-2">
                <span className={`w-2 h-2 ${listening ? 'bg-red-400 animate-pulse' : 'bg-green-400'} rounded-full`}></span>
                Voice Mode - {listening ? 'Listening' : 'Ready'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`${autoSpeak ? 'bg-white/30' : 'bg-white/10'} hover:bg-white/40 transition-all duration-200 w-11 h-11 flex items-center justify-center rounded-xl backdrop-blur-sm group`}
              title={autoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
            >
              {autoSpeak ? 
                <HiVolumeUp color="white" size={24} className="group-hover:scale-110 transition-transform" /> : 
                <HiVolumeOff color="white" size={24} className="group-hover:scale-110 transition-transform" />
              }
            </button>
            <button 
              onClick={() => setMode("chat")}
              className="bg-white hover:bg-purple-50 transition-all duration-300 w-11 h-11 flex items-center justify-center rounded-xl shadow-lg group hover:shadow-xl"
              title="Switch to chat mode"
            >
              <GiTalk color="#c026d3" size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Voice Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          
          {/* Listening Animation */}
          <div className="mb-10 mt-75 relative">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              listening 
                ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-red-400/50 scale-110' 
                : processingVoice
                ? 'bg-gradient-to-br from-yellow-500 to-orange-600 shadow-yellow-400/50 animate-pulse'
                : isSpeaking
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-400/50 animate-pulse'
                : 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-400/30'
            }`}>
              {listening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute inset-0 rounded-full bg-red-400/10 animate-ping" style={{animationDelay: '1s'}}></div>
                </>
              )}
              <BiMicrophone 
                size={listening ? 90 : 80} 
                color="white" 
                className={`transition-all ${listening ? 'animate-bounce' : ''}`} 
              />
            </div>
            
            {/* Status Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full bg-white shadow-xl border-2 border-gray-100">
              <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                {listening ? (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Recording
                  </>
                ) : processingVoice ? (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    Processing
                  </>
                ) : isSpeaking ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Speaking
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Idle
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Transcript Display */}
          <div className="w-full max-w-3xl mb-10 relative">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-inner border-2 border-purple-100 min-h-[180px] max-h-[280px] overflow-y-auto">
              {transcript ? (
                <p className="text-gray-800 text-lg leading-relaxed font-medium">{transcript}</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BiMicrophone size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-400 italic">Start speaking and your words will appear here...</p>
                </div>
              )}
            </div>
            
            {transcript && (
              <button
                onClick={clearTranscript}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl group"
                title="Clear transcript"
              >
                <MdClear color="white" size={22} className="group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-8 items-center mb-8">
            {!listening ? (
              <button
                onClick={startListening}
                disabled={processingVoice || isSpeaking}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-3xl rounded-2xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                title="Start listening"
              >
                <BiMicrophone size={40} color="white" className="group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-2xl hover:shadow-3xl rounded-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse group"
                title="Stop listening"
              >
                <IoStopCircleOutline size={40} color="white" className="group-hover:scale-110 transition-transform" />
              </button>
            )}

            {transcript && !listening && (
              <button
                onClick={handleVoiceSend}
                disabled={clicked || processingVoice}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-2xl hover:shadow-3xl rounded-2xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                title="Send message"
              >
                <FiSend size={36} color="white" className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-2xl hover:shadow-3xl rounded-2xl flex items-center justify-center transition-all hover:scale-110 group"
                title="Stop speaking"
              >
                <HiVolumeOff size={40} color="white" className="group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-base font-medium">
              {listening 
                ? '🎤 Listening to your voice... Click stop when done' 
                : transcript
                ? '✅ Click the send button to submit your message'
                : '🎙️ Click the microphone to start voice input'}
            </p>
          </div>

          {/* Recent Conversation */}
          {messages.length > 0 && (
            <div className="w-full max-w-3xl">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Recent Conversation</p>
                  <button 
                    onClick={clearAllMessages}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Clear all"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {messages.slice(-4).map((msg, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === "user" 
                          ? "bg-blue-500" 
                          : "bg-purple-500"
                      }`}>
                        <span className="text-white text-xs font-bold">
                          {msg.sender === "user" ? "U" : "AI"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold mb-1 ${
                          msg.sender === "user" ? "text-blue-600" : "text-purple-600"
                        }`}>
                          {msg.sender === "user" ? "You" : "AI Assistant"}
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
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
  );
}

export default App;