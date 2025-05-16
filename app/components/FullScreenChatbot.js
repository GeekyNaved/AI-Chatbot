'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const FullScreenChatbot = () => {
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
                        <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">
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
        <div className="fixed inset-0 z-50 bg-white">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-medium text-gray-800 text-xl">Chat with us</h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 text-lg mt-8">
                            How can we help you today?
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
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
                <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3 max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 p-3 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                            aria-label="Message input"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            className={`p-3 rounded-lg transition-colors ${
                                isLoading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                            aria-label="Send message"
                            disabled={isLoading}
                        >
                            <FiSend size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullScreenChatbot; 