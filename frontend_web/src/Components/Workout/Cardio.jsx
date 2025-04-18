import React from 'react';
import DashboardTemplate from '/src/Components/DashboardSimple';

const Cardio = () => {
    return (
        <DashboardTemplate>
            <div className="banner bg-[#12417F] text-white text-center py-4">
                <h1 className="text-3xl font-bold">Cardio</h1>
            </div>
            <div>
                <h1>Cardio Workouts</h1>
                <p>
                    Welcome to the Cardio section. Here, you will find a variety of exercises and routines designed to improve your cardiovascular health and endurance. Stay consistent and enjoy your fitness journey.
                </p>
            </div>
        </DashboardTemplate>
    );
};

export default Cardio;