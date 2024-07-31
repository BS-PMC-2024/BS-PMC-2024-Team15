import React from 'react';

const CustomCourseComponent = ({ course }) => {
    return (
        <div className="custom-event">
            <strong>{course.name}</strong>
            <br />
            {/* <span>{event.description}</span> Display additional information */}
            {/* {event.imageUrl && <img src={event.imageUrl} alt="Event"  />} Display event image */}
        </div>
    );
};

export default CustomCourseComponent;
