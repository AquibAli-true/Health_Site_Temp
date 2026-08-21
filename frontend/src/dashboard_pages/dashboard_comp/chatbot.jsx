import { useState } from "react";
import sendMessageButton from "../../assets/svg/send_Ai.svg";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am your Nutrition Nerd AI assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setLoading(true);
    
    const userMsg = {
      id: Date.now(),
      text: userText,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userText,
        config: {
          systemInstruction:
            "You are a professional health, fitness, and nutrition coach for an app called Nutrition Nerd. You must ONLY answer questions related to diet, working out, meals, and healthy lifestyle choices. If the user asks about unrelated topics, politely decline and redirect them to health.",
        },
      });

      const botMessage = {
        id: Date.now(),
        text: response.text,
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-(--bg-main)">
    
      <div className="w-full min-h-[60px] font-poppins tracking-widest bg-(--bg-sidebar) text-(--off-white) flex p-4 justify-end items-center font-bold shadow-md z-10">
        Nutrition Nerd AI
      </div>

      <div className="flex-1 overflow-y-auto lg:p-10 sm:p-5 p-4 w-full flex flex-col gap-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`font-nunito p-4 rounded-2xl max-w-[85%] leading-relaxed lg:max-w-[65%] text-left text-base shadow-sm ${
              msg.isBot
                ? "mr-auto bg-(--bg-card-subtle) text-(--text-main) rounded-tl-none border border-(--bg-main)"
                : "ml-auto bg-(--accent-emerald) text-(--off-white) rounded-tr-none"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div className="mr-auto font-nunito p-4 rounded-2xl rounded-tl-none bg-(--bg-card-subtle) text-(--text-muted) text-base shadow-sm">
            Typing...
          </div>
        )}
      </div>

  
      <div className="w-full p-4 flex justify-center pb-6 shrink-0">
        <form
          className="md:w-[75%] w-[85%] bg-(--bg-card) px-4 py-2 rounded-2xl flex items-end shadow-lg border border-(--bg-card-subtle)"
          onSubmit={handleSubmit}
        >
          <textarea
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 min-h-[48px] max-h-48 overflow-y-auto resize-none bg-transparent text-(--text-main) font-poppins text-base py-3 px-2 outline-none placeholder-(--text-muted)"
            placeholder="Ask Nutrition Nerd AI..."
            rows={1}
          />
          <button
            className="cursor-pointer p-2 mb-1 shrink-0 disabled:opacity-50 transition-transform hover:scale-105"
            type="submit"
            disabled={loading || !input.trim()}
          >
            <img
              className="w-8 h-8"
              src={sendMessageButton}
              alt="send message to ai"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;