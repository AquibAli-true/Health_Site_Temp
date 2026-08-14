import { useState } from "react";
import sendMessageButton from "../../assets/svg/send_Ai.svg";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am your Diet+ AI assistant. How can I help you today?",
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
    const userText = input;
    setInput("");
    setLoading(true);
    const userMsg = {
      id: Date.now(),
      text: userText,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    console.log(messages);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userText,
        config: {
          systemInstruction:
            "You are a professional health, fitness, and nutrition coach for an app called Diet+. You must ONLY answer questions related to diet, working out, meals, and healthy lifestyle choices. If the user asks about unrelated topics, politely decline and redirect them to health.",
        },
      });
      console.log(response.text);
      const botMessage = {
        id: Date.now(),
        text: response.text,
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
      console.log(messages);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-(--bg-main)">
      <div className="w-full min-h-[60px] bg-(--accent-emerald) text-white flex p-4 justify-end items-center font-bold">
        Diet+ AI
      </div>

      <div className="flex-1 overflow-y-auto lg:p-10 sm:p-5 p-4 w-full flex flex-col gap-5 text-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`font-nunito p-3 bg-[#EDF3F1] border rounded-xl text-(--text-main) max-w-[85%] leading-loose lg:max-w-[65%] text-left text-md ${
              msg.isBot
                ? "mr-auto border-[#d3dfd9] "
                : "ml-auto border-[#10b981] "
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="w-full p-4 flex justify-center pb-6">
        <form
          className="md:w-[75%] relative w-[85%] min-h-15 gap-2 bg-(--bg-card) px-4 rounded-2xl text-white flex justify-center items-center shadow-lg"
          onSubmit={(e) => handleSubmit(e)}
        >
          <textarea
            onInput={handleInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-[95%] min-h-12 max-h-48 text overflow-y-auto resize-none bg-(--bg-card) text-(--text-main) font-poppins text-md py-4 px-2 outline-none placeholder-gray-400"
            placeholder="Ask Diet+ AI..."
          />
          <button
            className="cursor-pointer absolute bottom-0 right-0 py-4 px-2 shrink-0 disabled:opacity-50"
            type="submit"
            disabled={loading}
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
