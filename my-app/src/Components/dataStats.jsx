import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import Icon from "./icon";
import Button from "./btn";

const displayValue = (value, suffix = "") => {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not provided";
  }

  return value ? `${value}${suffix}` : "Not provided";
};

function DataStats({ inquiryData = {}, setInquiryData, onBack }) {
  const [editValue, setEditValue] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fields = [
    {
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
      label: "Goal Deadline",
      key: "goal",
      value: displayValue(inquiryData.goal),
    },
  ];

  const handleEdit = (field) => {
    const currentValue = inquiryData[field.key];

    setEditValue(
      Array.isArray(currentValue)
        ? currentValue.join(", ")
        : currentValue ?? ""
    );

    setEditingKey(field.key);
    setSaveError("");
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
    setSaveError("");
  };

  const handleSaveEdit = async (field) => {
    if (isSaving) return;

    const currentValue = inquiryData[field.key];

    const formattedValue = Array.isArray(currentValue)
      ? editValue
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : editValue.trim();

    const updatedInquiryData = {
      ...inquiryData,
      [field.key]: formattedValue,
    };

    try {
      setIsSaving(true);
      setSaveError("");

      if (auth.currentUser) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            inquiryData: updatedInquiryData,
          },
          { merge: true }
        );
      } else {
        localStorage.setItem(
          "inquiryData",
          JSON.stringify(updatedInquiryData)
        );
      }

      setInquiryData(updatedInquiryData);
      setEditingKey(null);
      setEditValue("");
    } catch (error) {
      console.error("Failed to save inquiry changes:", error);
      setSaveError("Your change could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="profile-page">
      <button
        type="button"
        className="profile-back-button"
        onClick={onBack}
      >
        <Icon name="arrow-left" size={18} />
        Back
      </button>

      <header className="profile-header">
        <p className="card-eyebrow">Your account</p>
        <h1>Profile</h1>
        <p>Your answers from the fitness inquiry.</p>
      </header>

      <section
        className="profile-data-card"
        aria-label="Inquiry data"
      >
        {fields.map((field) => (
          <div className="profile-data-row" key={field.key}>
            <span>{field.label}</span>

            {editingKey === field.key ? (
              <div className="profile-edit-controls">
                <input
                  type="text"
                  aria-label={`Edit ${field.label}`}
                  value={editValue}
                  onChange={(event) =>
                    setEditValue(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSaveEdit(field);
                    }

                    if (event.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                  disabled={isSaving}
                  autoFocus
                />

                <button
                  type="button"
                  className="profile-edit-save"
                  onClick={() => handleSaveEdit(field)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="profile-edit-cancel"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <strong>{field.value}</strong>

                <Button
                  color="white"
                  text="Edit"
                  onClick={() => handleEdit(field)}
                />
              </>
            )}
          </div>
        ))}

        {saveError && (
          <p className="profile-save-error" role="alert">
            {saveError}
          </p>
        )}
      </section>
    </main>
  );
}

export default DataStats;