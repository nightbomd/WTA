import Icon from "./icon";
import Button from "./btn";

const displayValue = (value, suffix = "") => {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  return value ? `${value}${suffix}` : "Not provided";
};

function DataStats({ inquiryData = {}, onBack }) {
  const fields = [
    ["Name", displayValue(inquiryData.name)],
    ["Age range", displayValue(inquiryData.ageRange)],
    ["Height", displayValue(inquiryData.height, " cm")],
    ["Weight", displayValue(inquiryData.weight, " kg")],
    ["Primary goal", displayValue(inquiryData.fitnessGoal)],
    ["Experience", displayValue(inquiryData.experienceLevel)],
    ["Workout days", displayValue(inquiryData.workoutDaysPerWeek)],
    ["Training location", displayValue(inquiryData.trainingLocation)],
    ["Equipment", displayValue(inquiryData.equipment)],
    ["Priority muscles", displayValue(inquiryData.priorityMuscles)],
    ["Injuries or limitations", displayValue(inquiryData.injuries)],
  ];

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
        {fields.map(([label, value]) => (
          <div className="profile-data-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <Button color="white" text="edit" onClick={() => handleEdit(label)} className="auto px-3" />
          </div>
        ))}
      </section>
    </main>
  );
}

export default DataStats;
