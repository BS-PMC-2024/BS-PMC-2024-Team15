import React, { useState } from 'react';
import '../ComponentsCss/RankForm.css';

const RankForm = ({ event, onClose, onSave }) => {
    const [efficiencyRank, setEfficiencyRank] = useState(event.rank || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(efficiencyRank); 
        onClose(); 
    };

    return (
        <div className="modal-background">
            <div className="modal-content">
                <h2>Rank {event.title} task</h2>
                <p>Here you can rank your efficiency in this assignment from 0 - 10</p>
                <form onSubmit={handleSubmit}>
                    <div className="rating-options">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={value}>
                                <input
                                    type="radio"
                                    name="efficiencyRank"
                                    value={value}
                                    checked={efficiencyRank === value}
                                    onChange={(e) => setEfficiencyRank(parseInt(e.target.value))}
                                />
                                {value}
                            </label>
                        ))}
                    </div>
                    <div className="buttons-container">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RankForm;