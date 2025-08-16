import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
// import { Button } from '@/components/ui/button';

const Lecture = ({ lecture, index, courseId }) => {
    const navigate = useNavigate();

    // Function to handle navigation to the lecture update page
    const goToUpdateLecture = () => {
        navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
    };

    return (
        // Main container for the lecture item
        // Added styling for layout, padding, border, and hover effects
        <div
            className="flex items-center justify-between p-3 mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
            {/* Lecture title and index */}
            <h1 className="text-md font-medium text-gray-800 dark:text-gray-200">
                Lecture - {index + 1}: {lecture.lectureTitle}
            </h1>

            {/* Edit button */}
            <Edit
                onClick={goToUpdateLecture}
                size={20}
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
            >
            </Edit>
        </div>
    );
};

export default Lecture;