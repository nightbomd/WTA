import Icon from "./icon";
import Button from "./btn";
import { auth, db } from "../firebase.js";
import {doc, setDoc } from "firebase/firestore";

const displayValue = (value, suffix = "") => {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  return value ? `${value}${suffix}` : "Not provided";
};

function DataStats({ inquiryData = {}, setInquiryData, onBack }) {
  const fields = [{
    label: "Name",
    key: "name",
    value: displayValue(inquiryData.name),
  },
  {
    label: "Age range",
    key: "ageRange",
    value: displayValue(inquiryData.ageRange),
  },
  {
    label: "Height",
    key: "height",
    value: displayValue(inquiryData.height, " cm"),
  },
  {
    label: "Weight",
    key: "weight",
    value: displayValue(inquiryData.weight, " kg"),
  },
  {
    label: "Primary goal",
    key: "fitnessGoal",
    value: displayValue(inquiryData.fitnessGoal),
  },
  {
    label: "Experience",
    key: "experienceLevel",
    value: displayValue(inquiryData.experienceLevel),
  },
  {
    label: "Workout days",
    key: "workoutDaysPerWeek",
    value: displayValue(inquiryData.workoutDaysPerWeek),
  },
  {
    label: "Training location",
    key: "trainingLocation",
    value: displayValue(inquiryData.trainingLocation),
  },
  {
    label: "Equipment",
    key: "equipment",
    value: displayValue(inquiryData.equipment),
  },
  {
    label: "Priority muscles",
    key: "priorityMuscles",
    value: displayValue(inquiryData.priorityMuscles),
  },
  {
    label: "Injuries or limitations",
    key: "injuries",
    value: displayValue(inquiryData.injuries),
  },
  ];

  const handleEdit = async (index) => {
    const field = fields[index];
    const currentValue = inquiryData[field.key];

    const promptValue = Array.isArray(currentValue)
      ? currentValue.join(", ")
      : currentValue ?? "";

    const newValue = window.prompt(
      `Enter your new ${field.label.toLowerCase()}:`,
      promptValue
    );

    // Don't change anything if Cancel was pressed.
    if (newValue === null) return;

    // Keep array fields as arrays.
    const arrayFields = ["equipment", "priorityMuscles"];

    const formattedValue = arrayFields.includes(field.key)
      ? newValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
      : newValue.trim();

    const updatedInquiryData = {
      ...inquiryData,
      [field.key]: formattedValue,
    };

    // Immediately update the information displayed in the app.
    setInquiryData(updatedInquiryData);

    try {
      if (auth.currentUser) {
        // Signed-in users: save to their Firebase document.
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            inquiryData: updatedInquiryData,
          },
          { merge: true }
        );
      } else {
        // Guests: save only on this device.
        localStorage.setItem(
          "inquiryData",
          JSON.stringify(updatedInquiryData)
        );
      }
    } catch (error) {
      console.error("Failed to save inquiry changes:", error);
    }
  };

  return (
    <main className="profile-page">
      <button type="button" className="profile-back-button" onClick={onBack}>
        <Icon name="arrow-left" size={18} />
        Back
      </button>

      <header className="profile-header">
        <p className="card-eyebrow">Your account</p>
        <h1>Profile</h1>
        <p>Your answers from the fitness inquiry.</p>
      </header>

      <section className="profile-data-card" aria-label="Inquiry data">
        {fields.map((field, index) => (
          <div className="profile-data-row" key={field.key}>
            <span>{field.label}</span>
            <strong>{field.value}</strong>
            <Button color="white" text="edit" onClick={() => handleEdit(index)} className="auto px-3" />
          </div>
        ))}
      </section>
    </main>
  );
}

export default DataStats;
