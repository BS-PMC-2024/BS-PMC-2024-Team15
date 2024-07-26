import React, { useState } from 'react';
import '../ComponentsCss/AiChatForm.css';

const AIAssistantComponent = ({ isOpen, onClose }) => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessage = { role: 'user', content: userInput };
        setChatHistory([...chatHistory, newMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/aibot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_input: newMessage.content, action: 'Chat' }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            const assistantMessage = { role: 'assistant', content: data.content };
            setChatHistory((prevChatHistory) => [...prevChatHistory, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory((prevChatHistory) => [
                ...prevChatHistory,
                { role: 'system', content: 'Error: Could not send message. Please try again later.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/aibot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_input: '', action: 'Finish Order' }),
            });

            if (!response.ok) {
                throw new Error('Failed to finish order');
            }

            const data = await response.json();
            const assistantMessage = { role: 'assistant', content: JSON.stringify(data, null, 2) };
            setChatHistory((prevChatHistory) => [...prevChatHistory, assistantMessage]);
        } catch (error) {
            console.error('Error finishing order:', error);
            setChatHistory((prevChatHistory) => [
                ...prevChatHistory,
                { role: 'system', content: 'Error: Could not finish order. Please try again later.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`ai-assistant ${isOpen ? 'open' : 'closed'}`}>
            <div className="ai-assistant-content">
                <h2>Hello! I am your StudyBuddy</h2>

                {/* Chat history */}
                <div className="chat-history">
                    {chatHistory.map((message, index) => (
                        <p key={index} className={`message ${message.role}`}>
                            <strong>{message.role}:</strong> {message.content}
                        </p>
                    ))}
                    {isLoading && <p className="message assistant">Loading...</p>}
                </div>

                {/* Chat input */}
                <textarea
                    placeholder="How can I help you?"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows="3"
                />

                {/* Quick actions */}
                <div className="quick-actions">
                    <button onClick={() => setUserInput('Studying')}>Studying</button>
                    <button onClick={() => setUserInput('Time management')}>Time management</button>
                    {/* add more as needed */}
                </div>

                {/* Buttons */}
                <div className="button-container">
                    <button onClick={onClose} className="close-btn">Close</button>
                    <button onClick={handleSend} className="send-btn">Send</button>
                    <button onClick={handleFinishOrder} className="finish-btn">Finish Order</button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistantComponent;