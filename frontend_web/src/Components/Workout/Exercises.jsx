import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardTemplate from '/src/Components/DashboardTemplate';
import { Box } from '@mui/material'; // Import MUI Box
import bg from '/src/assets/gif/consentbg.gif'; // Import background image
import logoFF from '/src/assets/images/logoFitFlow.png'; // Import logo image
import backButton from '/src/assets/images/LeftArrow.png'; // Import back button image

const Waiver = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const queryParams = new URLSearchParams(location.search);
    const workoutStyle = decodeURIComponent(queryParams.get('workoutStyle')); // Decode URL-encoded value
    const workoutID = queryParams.get('workoutID'); // Extract workoutID
    const userID = queryParams.get('userID'); // Extract userID

    const handleProceed = () => {
        if (isChecked) {
            console.log('Workout Style:', workoutStyle); // Debugging log
            console.log('Workout ID:', workoutID); // Debugging log
            console.log('User ID:', userID); // Debugging log

            switch (workoutStyle) {
                case 'Strength Training':
                    navigate(`/strength-training?workoutID=${workoutID}&userID=${userID}`);
                    break;
                case 'Cardio':
                    navigate(`/cardio?workoutID=${workoutID}&userID=${userID}`);
                    break;
                case 'Flexibility/Yoga':
                    navigate(`/flexi-yoga?workoutID=${workoutID}&userID=${userID}`);
                    break;
                default:
                    navigate(`/workout`);
                    break;
            }
        }
    };

    return (
        <DashboardTemplate>
            <Box m={0} p={0} className="min-h-screen flex justify-center items-center relative"
                style={{
                    backgroundImage: bg,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%',
                }}
            >
                {/* FitFlow Logo */}
                <img
                    src={logoFF}
                    alt="FitFlow Logo"
                    className="absolute top-4 right-4 w-16 h-16"
                />
                <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
                    {/* Back button */}
                    <button
                        className="flex items-center text-gray-600 mb-6 hover:text-gray-800 transition"
                        onClick={() => navigate(-1)}
                    >
                        <img
                            src={backButton}
                            alt="Back"
                            className="w-5 h-5 mr-2"
                        />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                        FitFlow Commitment Waiver
                    </h1>
                    <p className="text-gray-600 mb-8 text-justify leading-relaxed">
                        By proceeding, I acknowledge and agree to the following:
                    </p>
                    <ul className="list-disc list-inside space-y-4 text-gray-600 mb-8 text-justify leading-relaxed">
                        <li>I am voluntarily participating in physical activities and exercises.</li>
                        <li>I understand that these activities may involve risks of injury, discomfort, or other unforeseen circumstances.</li>
                        <li>I confirm that I am in good health and have consulted a medical professional if necessary before engaging in these activities.</li>
                        <li>I take full responsibility for my health, safety, and progress during my fitness journey.</li>
                        <li>I commit to consistency, effort, and a positive mindset to achieve my fitness goals.</li>
                        <li>I release the organizers, trainers, and any associated parties from any liability arising from my participation.</li>
                    </ul>
                    <div className="flex items-center mb-8">
                        <input
                            type="checkbox"
                            id="agree"
                            className="mr-3 w-5 h-5"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="agree" className="text-gray-600 text-sm">
                            I agree to the terms and conditions stated above.
                        </label>
                    </div>
                    <button
                        className={`w-full py-3 font-medium rounded-lg shadow-lg transition ${
                            isChecked
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                        onClick={handleProceed}
                        disabled={!isChecked}
                    >
                        Accept and Proceed
                    </button>
                </div>
            </Box>
        </DashboardTemplate>
    );
};

export default Waiver;