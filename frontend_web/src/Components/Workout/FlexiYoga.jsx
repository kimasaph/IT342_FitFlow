import React from "react";
import DashboardTemplate from "/src/Components/DashboardSimple"; // Corrected path

const FlexiYoga = () => {
  return (
    <DashboardTemplate>
      <div className="banner bg-[#12417F] text-white text-center py-4">
        <h1 className="text-3xl font-bold">Flexibility and Yoga</h1>
      </div>
      <div>
        <h1>Flexibility and Yoga</h1>
        <p>
          Yoga is a great way to improve flexibility, strength, and mindfulness. 
                    It involves a series of poses and stretches that help to loosen tight muscles, 
                    improve posture, and promote relaxation.
                </p>
                <h2>Basic Yoga Poses for Flexibility</h2>
                <ul>
                    <li>Downward Dog (Adho Mukha Svanasana)</li>
                    <li>Child's Pose (Balasana)</li>
                    <li>Cat-Cow Stretch (Marjaryasana-Bitilasana)</li>
                    <li>Seated Forward Bend (Paschimottanasana)</li>
                    <li>Butterfly Pose (Baddha Konasana)</li>
                </ul>
                <p>
                    Remember to practice regularly and listen to your body. Yoga is not about perfection, 
                    but about progress and self-awareness.
        </p>
      </div>
    </DashboardTemplate>
  );
};

export default FlexiYoga;