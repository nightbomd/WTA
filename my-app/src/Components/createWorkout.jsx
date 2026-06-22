



import ProgressBar from './progressBar';
// --- Mock ProgressBar (remove and use your real one) ---


// --- Constants ---
import { useState, useRef, useEffect } from "react";



// --- Constants ---
const WORKOUT_TYPES = ["Push", "Pull", "Legs", "Upper", "Lower", "Full Body", "Cardio", "Custom"];
const MUSCLE_TAGS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Core", "Calves"];
const STEP_COUNT = 3;

const STEPS = [
  { label: "Name & Type", progress: 33 },
  { label: "Exercises",   progress: 66 },
  { label: "Review",      progress: 100 },
];

// --- Small reusable chip ---
const Chip = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "7px 14px",
      borderRadius: 99,
      border: selected ? "1.5px solid #3b82f6" : "1.5px solid #2a2a2a",
      background: selected ? "rgba(59,130,246,0.12)" : "#161616",
      color: selected ? "#3b82f6" : "#aaa",
      fontSize: 13,
      fontWeight: selected ? 700 : 500,
      cursor: "pointer",
      transition: "all 0.15s ease",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}
  >
    {label}
  </button>
);

// --- Step 1: Name & Type ---
const StepNameType = ({ data, onChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Workout Name */}
      <div>
        <label style={styles.label}>Workout Name</label>
        <input
          type="text"
          placeholder="e.g. Monday Push Day"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
          style={styles.input}
          autoFocus
        />
      </div>

      {/* Workout Type */}
      <div>
        <label style={styles.label}>Type</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {WORKOUT_TYPES.map(t => (
            <Chip key={t} label={t} selected={data.type === t} onClick={() => onChange({ ...data, type: t })} />
          ))}
        </div>
      </div>

      {/* Target Muscles */}
      <div>
        <label style={styles.label}>Target Muscles</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {MUSCLE_TAGS.map(m => (
            <Chip
              key={m}
              label={m}
              selected={data.muscles.includes(m)}
              onClick={() => {
                const next = data.muscles.includes(m)
                  ? data.muscles.filter(x => x !== m)
                  : [...data.muscles, m];
                onChange({ ...data, muscles: next });
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

// --- Exercise Card ---
const ExerciseCard = ({ exercise, onUpdate, onRemove }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: open ? 14 : 0 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#f0f0f0" }}>{exercise.name}</div>
          {!open && (
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              {exercise.sets} sets · {exercise.reps} reps · {exercise.weight ? exercise.weight + " lbs" : "Bodyweight"}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setOpen(o => !o)} style={styles.iconBtn}>
            {open ? "▲" : "▼"}
          </button>
          <button onClick={onRemove} style={{ ...styles.iconBtn, color: "#ef4444" }}>✕</button>
        </div>
      </div>

      {open && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { key: "sets",   label: "Sets",   placeholder: "4" },
            { key: "reps",   label: "Reps",   placeholder: "10" },
            { key: "weight", label: "Weight", placeholder: "lbs" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <input
                type="number"
                placeholder={placeholder}
                value={exercise[key] || ""}
                onChange={e => onUpdate({ ...exercise, [key]: e.target.value })}
                style={{ ...styles.input, padding: "10px 8px", textAlign: "center", fontSize: 15 }}
              />
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notes</div>
            <input
              type="text"
              placeholder="Optional note..."
              value={exercise.notes || ""}
              onChange={e => onUpdate({ ...exercise, notes: e.target.value })}
              style={{ ...styles.input, fontSize: 13 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Step 2: Add Exercises ---
const StepExercises = ({ exercises, onUpdate }) => {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const addExercise = () => {
    if (!query.trim()) return;
    onUpdate([...exercises, { id: Date.now(), name: query.trim(), sets: "", reps: "", weight: "", notes: "" }]);
    setQuery("");
    setShowAdd(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {exercises.length === 0 && !showAdd && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#444" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🏋️</div>
          <div style={{ fontSize: 14 }}>No exercises yet.</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Tap below to add one.</div>
        </div>
      )}

      {exercises.map((ex, i) => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          onUpdate={updated => onUpdate(exercises.map((e, idx) => idx === i ? updated : e))}
          onRemove={() => onUpdate(exercises.filter((_, idx) => idx !== i))}
        />
      ))}

      {showAdd ? (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Exercise name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addExercise()}
            autoFocus
            style={{ ...styles.input, flex: 1 }}
          />
          <button onClick={addExercise} style={styles.primaryBtn}>Add</button>
          <button onClick={() => setShowAdd(false)} style={styles.ghostBtn}>✕</button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} style={styles.addExerciseBtn}>
          + Add Exercise
        </button>
      )}

    </div>
  );
};

// --- Step 3: Review ---
const StepReview = ({ data, exercises }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

    <div style={styles.card}>
      <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Overview</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{data.name || "Untitled Workout"}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {data.type && <span style={styles.badge}>{data.type}</span>}
        {data.muscles.map(m => <span key={m} style={{ ...styles.badge, background: "rgba(99,102,241,0.12)", color: "#818cf8", borderColor: "rgba(99,102,241,0.25)" }}>{m}</span>)}
      </div>
    </div>

    <div style={{ fontSize: 11, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", paddingLeft: 4 }}>
      {exercises.length} Exercise{exercises.length !== 1 ? "s" : ""}
    </div>

    {exercises.map((ex, i) => (
      <div key={ex.id} style={{ ...styles.card, padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#f0f0f0" }}>{ex.name}</div>
          <div style={{ display: "flex", gap: 12 }}>
            {ex.sets && <span style={styles.statChip}>{ex.sets} sets</span>}
            {ex.reps && <span style={styles.statChip}>{ex.reps} reps</span>}
            {ex.weight && <span style={{ ...styles.statChip, color: "#3b82f6" }}>{ex.weight} lbs</span>}
          </div>
        </div>
        {ex.notes && <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>{ex.notes}</div>}
      </div>
    ))}

    {exercises.length === 0 && (
      <div style={{ textAlign: "center", padding: 20, color: "#555", fontSize: 14 }}>No exercises added.</div>
    )}
  </div>
);

// --- Main Component ---
export default function CreateWorkout({ isLoadingWorkout, onSave }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [animating, setAnimating] = useState(false);
  const [workoutData, setWorkoutData] = useState({ name: "", type: "", muscles: [] });
  const [exercises, setExercises] = useState([]);

  const canNext = () => {
    if (step === 0) return workoutData.name.trim().length > 0 && workoutData.type;
    if (step === 1) return exercises.length > 0;
    return true;
  };

  const navigate = (dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(s => s + dir);
      setAnimating(false);
    }, 220);
  };

  const handleSave = () => {
    onSave?.({ ...workoutData, exercises });
  };

  if (!isLoadingWorkout) return null;

  return (
    <div style={styles.root}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Create <span style={{ color: "#3b82f6" }}>Your</span> Workout
        </h1>
        <div style={{ marginTop: 18 }}>
          <ProgressBar text={STEPS[step].label} value={STEPS[step].progress} bg="#3b82f6" />
        </div>
        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6,
              height: 6,
              borderRadius: 99,
              background: i === step ? "#3b82f6" : i < step ? "#6366f1" : "#2a2a2a",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 20px 0",
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${direction * 24}px)` : "translateX(0)",
        transition: animating ? "none" : "opacity 0.2s ease, transform 0.2s ease",
      }}>
        {step === 0 && <StepNameType data={workoutData} onChange={setWorkoutData} />}
        {step === 1 && <StepExercises exercises={exercises} onUpdate={setExercises} />}
        {step === 2 && <StepReview data={workoutData} exercises={exercises} />}
      </div>

      {/* Bottom Nav */}
      <div style={styles.bottomNav}>
        {step > 0 ? (
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        ) : (
          <div />
        )}

        {step < STEP_COUNT - 1 ? (
          <button
            onClick={() => canNext() && navigate(1)}
            disabled={!canNext()}
            style={{ ...styles.nextBtn, opacity: canNext() ? 1 : 0.35 }}
          >
            Next →
          </button>
        ) : (
          <button onClick={handleSave} style={styles.saveBtn}>
            Save Workout ✓
          </button>
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    background: "#0f0f0f",
    color: "#f0f0f0",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  },
  header: {
    padding: "52px 20px 16px",
    background: "#0f0f0f",
    borderBottom: "1px solid #1a1a1a",
    flexShrink: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.02em",
    color: "#fff",
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    background: "#161616",
    border: "1.5px solid #2a2a2a",
    borderRadius: 10,
    color: "#f0f0f0",
    fontSize: 15,
    padding: "13px 14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s ease",
  },
  card: {
    background: "#161616",
    borderRadius: 12,
    padding: "16px",
    border: "1px solid #222",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "#555",
    cursor: "pointer",
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 6,
  },
  addExerciseBtn: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    border: "1.5px dashed #2a2a2a",
    borderRadius: 12,
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  primaryBtn: {
    padding: "13px 20px",
    background: "#3b82f6",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },
  ghostBtn: {
    padding: "13px 14px",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    color: "#888",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  badge: {
    padding: "4px 10px",
    background: "rgba(59,130,246,0.1)",
    color: "#3b82f6",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
  },
  statChip: {
    fontSize: 12,
    color: "#666",
    fontWeight: 600,
  },
  bottomNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px 32px",
    borderTop: "1px solid #1a1a1a",
    background: "#0f0f0f",
    flexShrink: 0,
    gap: 12,
  },
  backBtn: {
    padding: "13px 20px",
    background: "#161616",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    color: "#aaa",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  nextBtn: {
    padding: "13px 28px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "-0.01em",
    fontFamily: "inherit",
    transition: "opacity 0.2s ease",
  },
  saveBtn: {
    flex: 1,
    padding: "15px 28px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
  },
};