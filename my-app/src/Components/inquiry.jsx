import ProgressBar from "./progressBar";
import { useState } from "react"
import Button from "./btn";

const formQuestion = [
  {
    step: 0,
    question: "What shall we call you?",
    type: "text",
  },
  {
    step: 1,
    question: "Age Range?",
    type: "select",
    options: [
      { value: "", label: "Select an age range" },
      { value: "<18", label: "<18" },
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55+", label: "55+" },
    ],
  },
  {
    step: 2,
    question: "Height and Weight",
    unit: "cm",
  },
  {
    step: 3,
    question: "What's your primary fitness goal?",
    type: "select",
    options: [
      { value: "", label: "Choose one" },
      { value: "build-muscle", label: "Build Muscle" },
      { value: "lose-fat", label: "Lose Fat" },
      { value: "gain-strength", label: "Gain Strength" },
      { value: "improve-endurance", label: "Improve Endurance" },
      { value: "general-health", label: "General Health" },
    ],
  },
  {
    step: 4,
    question: "How would you describe your experience/level?",
    type: "select",
    options: [
      { value: "", label: "Choose one" },
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  {
    step: 5,
    question: "How many days per week do you usually work out?",
    type: "select",
    options: [
      { value: "", label: "Choose one" },
      { value: "1", label: "1 Day" },
      { value: "2", label: "2 Days" },
      { value: "3", label: "3 Days" },
      { value: "4", label: "4 Days" },
      { value: "5", label: "5 Days" },
      { value: "6", label: "6 Days" },
      { value: "7", label: "7 Days" },
    ],
  },
  {
    step: 6,
    question: "Where do you usually train?",
    type: "select",
    options: [
      { value: "", label: "Choose one" },
      { value: "gym", label: "Commercial Gym" },
      { value: "home", label: "Home Gym" },
      { value: "both", label: "Both" },
      { value: "outdoors", label: "Outdoors" },
    ],
  },
  {
    step: 7,
    question: "What equipment do you have access to?",
    type: "multiselect",
    options: [
      "Barbell",
      "Dumbbells",
      "Machines",
      "Cable Machine",
      "Pull-up Bar",
      "Resistance Bands",
      "Kettlebells",
      "Bodyweight Only",
    ],
  },
  {
    step: 8,
    question: "What muscle groups do you prioritize?",
    type: "multiselect",
    options: [
      "Chest",
      "Back",
      "Shoulders",
      "Arms",
      "Legs",
      "Core",
      "Full Body",
    ],
  },
  {
    step: 9,
    question: "Any injuries or limitations?",
    type: "textarea",
  },
];

export default function Inquiry( {setIsRegistering }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    
   
    const getFieldKey = () => {
      switch(step) {
        case 0: return "name";
        case 1: return "ageRange";
        case 2: return "height";
        case 3: return "fitnessGoal";
        case 4: return "experienceLevel";
        case 5: return "workoutDaysPerWeek";
        case 6: return "trainingLocation";
        case 7: return "equipment";
        case 8: return "priorityMuscles";
        case 9: return "injuries";
        default: return "";
      }
    };

    const handleChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleHeightWeightChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleMultiSelect = (option) => {
      const key = getFieldKey();
      const current = formData[key] || [];
      const updated = current.includes(option)
        ? current.filter(item => item !== option)
        : [...current, option];
      handleChange(key, updated);
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
      setIsRegistering(true);
      localStorage.setItem('inquiryData', JSON.stringify(formData));
    }

    return (
        <main className="container p-5 col-sm-8 col-md-5 col-lg-5 text-center ">
            <h1>Lets Get you  <span style={{ color: "#3592f5ff" }}>Started</span>.</h1>
            <div className="logo text-center">
                <img style={{ width: '100px', height: '100px', margin: '0 auto' }} src="./public/download.png" alt="Logo"></img>
            </div>
            <ProgressBar bg="#007bff" value={(step / formQuestion.length) * 100} />
            <div className="question-container py-5">

                <h2 className="mb-5">{formQuestion[step].question}</h2>
                
                {step === 0 && (
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                )}

                {step === 1 && (
                    <select 
                      className="form-select"
                      value={formData.ageRange || ""}
                      onChange={(e) => handleChange("ageRange", e.target.value)}
                    >
                        {formQuestion[step].options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {step === 2 && (
                    <div className="d-flex flex-column gap-3" >
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Height (cm)"
                          value={formData.height || ""}
                          onChange={(e) => handleHeightWeightChange("height", e.target.value)}
                        />
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Weight (kg)"
                          value={formData.weight || ""}
                          onChange={(e) => handleHeightWeightChange("weight", e.target.value)}
                        />
                    </div>
                )}

                {step === 3 && (
                    <select 
                      className="form-select"
                      value={formData.fitnessGoal || ""}
                      onChange={(e) => handleChange("fitnessGoal", e.target.value)}
                    >
                        {formQuestion[step].options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {step === 4 && (
                    <select 
                      className="form-select"
                      value={formData.experienceLevel || ""}
                      onChange={(e) => handleChange("experienceLevel", e.target.value)}
                    >
                        {formQuestion[step].options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {step === 5 && (
                    <select 
                      className="form-select"
                      value={formData.workoutDaysPerWeek || ""}
                      onChange={(e) => handleChange("workoutDaysPerWeek", e.target.value)}
                    >
                        {formQuestion[step].options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {step === 6 && (
                    <select 
                      className="form-select"
                      value={formData.trainingLocation || ""}
                      onChange={(e) => handleChange("trainingLocation", e.target.value)}
                    >
                        {formQuestion[step].options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {step === 7 && (
                  <div>
                      {formQuestion[step].options.map((option) => (
                        <label key={option} className="d-block mb-3">
                          <input 
                            type="checkbox"
                            checked={(formData.equipment || []).includes(option)}
                            onChange={() => handleMultiSelect(option)}
                            className="form-check-input me-2"
                          />
                          {option}
                        </label>
                      ))}
                  </div>
                )}

                {step === 8 && (
                  <div>
                      {formQuestion[step].options.map((option) => (
                        <label key={option} className="d-block mb-3">
                          <input 
                            type="checkbox"
                            checked={(formData.priorityMuscles || []).includes(option)}
                            onChange={() => handleMultiSelect(option)}
                            className="form-check-input me-2"
                          />
                          {option}
                        </label>
                      ))}
                  </div>
                )}

                {step === 9 && (
                  <textarea 
                    className="form-control"
                    rows="5"
                    placeholder="Describe any injuries or limitations..."
                    value={formData.injuries || ""}
                    onChange={(e) => handleChange("injuries", e.target.value)}
                  />
                )}
            </div>

            <div className="d-flex gap-5">
                <Button 
                  onClick={() => setStep(step - 1)}
                  style={{ width: "100% !important" }}
                  text={"Back"}
                  bg="#282f36ff"
                  isDisabled={step === 0}
                />
                <Button 
                  onClick={step === formQuestion.length - 1 ? handleSubmit : () => setStep(step + 1)}
                  style={{ width: "100% !important" }}
                  text={step === formQuestion.length - 1 ? "Submit" : "Next"}
                 
                />
            </div>

        </main>
    );
}