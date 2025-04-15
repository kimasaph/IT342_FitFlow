import React from 'react';
import DashboardTemplate from './DashboardTemplate';

const StrengthTraining = () => {
    return (
        <DashboardTemplate>
            <div className="banner bg-[#12417F] text-white text-center py-4">
                <h1 className="text-3xl font-bold">Strength Training</h1>
            </div>
            <h1>Basic Strength Training</h1>
            <p>Welcome to the Basic Strength Training section. Here you will find exercises and tips to build your strength effectively.</p>
            <ul>
                <li>Push-ups</li>
                <li>Squats</li>
                <li>Deadlifts</li>
                <li>Bench Press</li>
                <li>Pull-ups</li>
            </ul>
        </DashboardTemplate>
    );
};

export default StrengthTraining;