import React from 'react';
import './GeneralMsgModal.css';

const GeneralMsgModal = ({ isOpen, onClose, onSend, notification, setNotification }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Send General Message</h2>
                <textarea
                    value={notification}
                    onChange={(e) => setNotification(e.target.value)}
                    placeholder="Enter your message here"
                ></textarea>
                <div className="modal-buttons">
                    <button onClick={onClose}>Back</button>
                    <button onClick={onSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default GeneralMsgModal;
