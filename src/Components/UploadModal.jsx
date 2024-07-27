import React, { useState } from 'react';
import '../ComponentsCss/UploadModal.css'; // Ensure you have the CSS file for styling

const UploadModal = ({ course, onClose }) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }
    
        setUploading(true);
    
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', description);
    
            const idToken = localStorage.getItem('accessToken');
            console.log(`Uploading file to http://localhost:5000/upload_file/${course.id}`);
            const response = await fetch(`http://localhost:5000/upload_file/${course.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to upload file: ${errorText}`);
            }
    
            onClose();
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Error uploading file');
        } finally {
            setUploading(false);
        }
    };
    

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Upload Material for {course.name}</h2>
                {error && <p className="error">{error}</p>}
                <input type="file" onChange={handleFileChange} />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="File description"
                />
                <div className="modal-buttons">
                    <button onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload PDF'}
                    </button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
