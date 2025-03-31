import React, { useState } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
} from "@mui/material";
import Dashboard from "./DashboardTemplate";

const Workout = () => {
  const [bodyType, setBodyType] = useState("Slim");
  const [fitnessGoal, setFitnessGoal] = useState("Build Muscle");
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [workoutStyle, setWorkoutStyle] = useState("Strength Training");
  const [healthConcerns, setHealthConcerns] = useState("");

  const handleNext = () => {
    console.log({
      bodyType,
      fitnessGoal,
      fitnessLevel,
      workoutStyle,
      healthConcerns,
    });
  };

  return (
    <Dashboard>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="700"
          color="#12417f"
          sx={{ mb: 3, fontFamily: "'Outfit', sans-serif" }}
        >
          Describe yourself
        </Typography>

        <Box sx={{ width: "100%", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Body Type
          </Typography>
          <RadioGroup
            row
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
          >
            <FormControlLabel value="Slim" control={<Radio />} label="Slim" />
            <FormControlLabel
              value="Muscular"
              control={<Radio />}
              label="Muscular"
            />
            <FormControlLabel value="Large" control={<Radio />} label="Large" />
          </RadioGroup>
        </Box>

        <Box sx={{ width: "100%", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Fitness Goal
          </Typography>
          <RadioGroup
            row
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
          >
            <FormControlLabel
              value="Build Muscle"
              control={<Radio />}
              label="Build Muscle"
            />
            <FormControlLabel
              value="Lose weight"
              control={<Radio />}
              label="Lose weight"
            />
            <FormControlLabel
              value="Maintain Fitness"
              control={<Radio />}
              label="Maintain Fitness"
            />
          </RadioGroup>
        </Box>

        <Box sx={{ width: "100%", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Current Fitness Level
          </Typography>
          <RadioGroup
            row
            value={fitnessLevel}
            onChange={(e) => setFitnessLevel(e.target.value)}
          >
            <FormControlLabel
              value="Beginner"
              control={<Radio />}
              label="Beginner"
            />
            <FormControlLabel
              value="Intermediate"
              control={<Radio />}
              label="Intermediate"
            />
            <FormControlLabel
              value="Advance"
              control={<Radio />}
              label="Advance"
            />
          </RadioGroup>
        </Box>

        <Box sx={{ width: "100%", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Preferred Workout Style
          </Typography>
          <RadioGroup
            row
            value={workoutStyle}
            onChange={(e) => setWorkoutStyle(e.target.value)}
          >
            <FormControlLabel
              value="Strength Training"
              control={<Radio />}
              label="Strength Training"
            />
            <FormControlLabel value="Cardio" control={<Radio />} label="Cardio" />
            <FormControlLabel
              value="Flexibility/Yoga"
              control={<Radio />}
              label="Flexibility/Yoga"
            />
          </RadioGroup>
        </Box>

        <Box sx={{ width: "100%", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Health Concerns
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter any health concerns"
            value={healthConcerns}
            onChange={(e) => setHealthConcerns(e.target.value)}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{
            bgcolor: "#1e5fb4",
            "&:hover": { bgcolor: "#12417f" },
            px: 4,
            py: 1,
            fontWeight: "600",
          }}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Dashboard>
  );
};

export default Workout;
