'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            type: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userMessage: inputMessage }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const botMessage = {
                type: 'bot',
                content: data.reply,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const MessageContent = ({ content, type }) => {
        if (type === 'user') {
            return <div>{content}</div>;
        }

        return (
            <ReactMarkdown
                components={{
                    p: ({ children }) => <p className="mb-2">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => (
                        <code className="bg-gray-200 rounded px-1 py-0.5 font-mono text-sm">
                            {children}
                        </code>
                    ),
                    pre: ({ children }) => (
                        <pre className="bg-gray-100 p-2 rounded-lg overflow-x-auto my-2">
                            {children}
                        </pre>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        );
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col mb-4"
                    >
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                            <h3 className="font-semibold text-gray-800">Chat Support</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Close chat"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-lg p-3 ${
                                            message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <MessageContent content={message.content} type={message.type} />
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Message input"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className={`p-2 rounded-lg transition-colors ${
                                        isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                    aria-label="Send message"
                                    disabled={isLoading}
                                >
                                    <FiSend size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default Chatbot;
