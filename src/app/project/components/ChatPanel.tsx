"use client";
import { Button } from "@/components/ui/button";
import { ArrowBigUpDash } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { text: input, sender: "user" },
      { text: `Response to "${input}"`, sender: "ai" },
    ]);
    setInput("");
  };

  const handleClear = () => setMessages([]);

  return (
    <div className="flex flex-col w-full max-w-3xl h-[500px] p-4 bg-gray-50 rounded-xl shadow-md">
      <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded-lg bg-white flex flex-col gap-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <h2 className="text-2xl font-bold mb-2">AI Chat Panel</h2>
            <p>Discuss your ideas with AI</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`px-4 py-2 rounded-lg max-w-[70%] break-words ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClear}>
          <ArrowBigUpDash/>
        </Button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default ChatPanel;
