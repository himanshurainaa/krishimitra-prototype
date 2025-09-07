import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getChatResponse } from '../services/geminiService';
import { Message } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';
import ChatIcon from './icons/ChatIcon';

const Chatbot: React.FC = () => {
  const { t } = useLocalization();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponseText = await getChatResponse(messages, input);
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I am having trouble connecting. Please try again later.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-250px)] bg-[#1c2e26]/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-green-500/20">
      <div className="flex items-center gap-3 p-4 border-b border-green-500/20">
        <ChatIcon className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-bold text-gray-200">{t('chatbotTitle')}</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${
                msg.sender === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-[#101d16] text-gray-300'
              }`}
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#101d16] text-gray-300 px-4 py-3 rounded-2xl shadow-md">
              <SpinnerIcon />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-green-500/20 bg-[#101d16]/50">
        <div className="flex items-center bg-[#101d16] rounded-xl border border-green-500/20 focus-within:ring-2 focus-within:ring-green-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatbotPlaceholder')}
            className="flex-1 p-3 bg-transparent border-none focus:outline-none placeholder-gray-500 text-gray-200"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-5 py-2 m-1 rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-all duration-300 transform active:scale-95"
            disabled={isLoading}
          >
            {t('send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;