
import React, { useState, useRef, useEffect } from 'react';
import { askFinancialAssistant } from '../services/geminiService';
import { ChatMessage, Cotista } from '../types';
import { SendIcon, UserIcon, BotIcon } from './Icons';

interface ChatInterfaceProps {
  cotistas: Cotista[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ cotistas }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Olá! Como posso ajudar com a gestão da sua caixinha hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '', isLoading: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await askFinancialAssistant(input, cotistas);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot') {
          lastMessage.text = botResponse;
          lastMessage.isLoading = false;
        }
        return newMessages;
      });
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot') {
          lastMessage.text = "Desculpe, ocorreu um erro. Tente novamente.";
          lastMessage.isLoading = false;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 p-2">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
    </div>
  );


  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200/80 flex flex-col h-[34rem]">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Assistente Virtual</h3>
        <p className="text-sm text-slate-500">Tire suas dúvidas sobre a caixinha</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50/50 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-5 h-5" />
              </div>
            )}
            <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-slate-200 text-slate-800 rounded-bl-none'
            }`}>
              {msg.isLoading ? <TypingIndicator /> : <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
            </div>
             {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte aqui..."
            disabled={isLoading}
            className="flex-grow px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                       focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
