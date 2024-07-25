import React from 'react';
import '../ComponentsCss/AiChatForm.css';

const AIAssistantComponent = ({ isOpen, onClose }) => {
    return (
        <div className={`ai-assistant ${isOpen ? 'open' : 'closed'}`}>
            <div className="ai-assistant-content">
                <h2>Hello! I am your StudyBuddy</h2>

                {/* Chat input */}
                <textarea placeholder="How can I help you?" />
                <>Quick Tips</>
                {/* Quick actions */}
                <div className="quick-actions">
                    <button>Studdying </button>
                    <button>Time management </button>
                    {/* add more as needed */}
                </div>

                {/* Buttons */}
                <div className="button-container">
                    <button onClick={onClose} className="close-btn">Close</button>
                    <button className="send-btn">Send!</button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistantComponent;
