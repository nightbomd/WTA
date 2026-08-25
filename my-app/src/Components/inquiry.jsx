import ProgressBar from "./progressBar";
import { useState } from "react"
import Button from "./btn";
import { db, auth } from "../firebase"
import { doc, setDoc } from "firebase/firestore";

const user = auth.currentUser;

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
      { id: "18-24", name: "18-24", img: "👶" },
      { id: "25-34", name: "25-34", img: "🧑" },
      { id: "35-44", name: "35-44", img: "🧔" },
      { id: "45-54", name: "45-54", img: "👴" },
      { id: "55+", name: "55+", img: "👵" },
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
      { id: "lose-fat", name: "Lose Fat", img: "🔥" },
      { id: "build-muscle", name: "Build Muscle", img: "💪" },
      { id: "gain-strength", name: "Gain Strength", img: "🏋️" },
      { id: "improve-endurance", name: "Improve Endurance", img: "🏃" },
      { id: "general-health", name: "General Health", img: "🩺" },
    ],
  },
  {
    step: 4,
    question: "How would you describe your experience/level?",
    type: "select",
    options: [
      { id: "beginner", name: "Beginner", image: "👶" },
      { id: "intermediate", name: "Intermediate", image: "🧑" },
      { id: "advanced", name: "Advanced", image: "🧔" },
    ],
  },
  {
    step: 5,
    question: "How many days per week do you usually work out?",
    type: "select",
    options: [

      { id: "1", name: "1 Day", image: "📅" },
      { id: "2", name: "2 Days", image: "📅" },
      { id: "3", name: "3 Days", image: "📅" },
      { id: "4", name: "4 Days", image: "📅" },
      { id: "5", name: "5 Days", image: "📅" },
      { id: "6", name: "6 Days", image: "📅" },
      { id: "7", name: "7 Days", image: "📅" },
    ],
  },
  {
    step: 6,
    question: "Where do you usually train?",
    type: "select",
    options: [
      { id: "gym", name: "Commercial Gym", image: "🏢" },
      { id: "home", name: "Home Gym", image: "🏠" },
      { id: "both", name: "Both", image: "🏋️‍♂️" },
      { id: "outdoors", name: "Outdoors", image: "🌳" },
    ],
  },
  {
    step: 7,
    question: "What equipment do you have access to?",
    type: "multiselect",
    options: [
      { id: "barbell", name: "Barbell", image: "🏋️" },
      { id: "dumbbells", name: "Dumbbells", image: "💪" },
      { id: "machines", name: "Machines", image: "⚙️" },
      { id: "cable", name: "Cable Machine", image: "🔗" },
      { id: "pullup", name: "Pull-up Bar", image: "🪜" },
      { id: "bands", name: "Resistance Bands", image: "🟢" },
      { id: "kettlebell", name: "Kettlebells", image: "🔔" },
      { id: "bodyweight", name: "Bodyweight", image: "🤸" }
    ],
  },
  {
    step: 8,
    question: "What muscle groups do you prioritize?",
    type: "multiselect",
    options: [
      { id: "chest", name: "Chest", img: "💪" },
      { id: "back", name: "Back", img: "💪" },
      { id: "shoulders", name: "Shoulders", img: "💪" },
      { id: "arms", name: "Arms", img: "💪" },
      { id: "legs", name: "Legs", img: "💪" },
      { id: "core", name: "Core", img: "💪" },
      { id: "full-body", name: "Full Body", img: "💪" },
    ],
  },
  {
    step: 9,
    question: "Any injuries or limitations?",
    type: "textarea",
  },
];


function OptionCards({ options, selected, setSelected }) {

  function toggleOption(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  return (
    <div className="option-grid">
      {options.map((option) => (
        <button
          key={option.id}
          className={`option-card ${selected.includes(option.id) ? "selected" : ""
            }`}
          onClick={() => toggleOption(option.id)}
        >
          <div className="option-image">
            {option.image}
          </div>

          <p>{option.name}</p>
        </button>
      ))}
    </div>
  );
}

export default function Inquiry({ setIsRegistering }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});



  const getFieldKey = () => {
    switch (step) {
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
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Form submitted:", formData);
      setIsRegistering(true);
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          inquiryData: formData
        },
        { merge: true }
      );
      console.log("Form Data added:", formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>

      <main className="container p-5 col-sm-8 col-md-5 col-lg-5 text-center ">
        <h1>Lets Get you  <span style={{ color: "#3592f5ff" }}>Started</span>.</h1>
        <div className="logo text-center">
          <img style={{ width: '100px', height: '100px', margin: '0 auto' }} src="./public/download.png" alt="Logo"></img>
        </div>
        <ProgressBar bg="#007bff" value={Math.floor(((step + 1) / formQuestion.length) * 100)} />
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
            <OptionCards
              options={formQuestion[step].options}
              selected={formData.ageRange || []}
              setSelected={(values) => handleChange("ageRange", values)}
            />
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
            <OptionCards
              options={formQuestion[step].options}
              selected={formData.fitnessGoal || ["lose-fat", "general-health"]}
              setSelected={(values) => handleChange("fitnessGoal", values)}
            />
          )}

          {step === 4 && (
            <OptionCards
              options={formQuestion[step].options}
              selected={formData.experienceLevel || ["beginner"]}
              setSelected={(values) => handleChange("experienceLevel", values)}
            />
          )}

          {step === 5 && (
            <OptionCards
              options={formQuestion[step].options}
              selected={formData.workoutDaysPerWeek || []}
              setSelected={(values) => handleChange("workoutDaysPerWeek", values)}
            />
          )}

          {step === 6 && (
            <OptionCards
              options={formQuestion[step].options}
              selected={formData.trainingLocation || ["gym", "home"]}
              setSelected={(values) => handleChange("trainingLocation", values)}
            />
          )}

          {step === 7 && (

            <OptionCards
              options={formQuestion[step].options}
              selected={formData.equipment || ["dumbbells", "barbell", "bodyweight"]}
              setSelected={(values) => handleChange("equipment", values)}
            />
          )}

          {step === 8 && (
            <OptionCards
              options={formQuestion[step].options}
              selected={formData.priorityMuscles || []}
              setSelected={(values) => handleChange("priorityMuscles", values)}
            />
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
    </>
  );
}