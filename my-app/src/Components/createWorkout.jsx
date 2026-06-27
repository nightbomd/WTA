import { useState, useEffect } from "react";

// --- Constants ---
const WORKOUT_TYPES = ["Push", "Pull", "Legs", "Upper", "Lower", "Full Body", "Cardio", "Custom"];
const MUSCLE_TAGS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Core", "Calves"];
const STEP_COUNT = 3;
const STEPS = [
  { label: "Name & Type", progress: 33 },
  { label: "Exercises",   progress: 66 },
  { label: "Review",      progress: 100 },
];

// --- Exercise Search Data ---
const searchQuery = [
  { muscle: "Chest",      keywords: ["Bench Press", "Push-Up", "Chest Fly", "Cable Crossover", "Incline DB Press", "Machine Press", "Smith Machine Press", "Decline Press", "Pec Deck"] },
  { muscle: "Back",       keywords: [ "Wide-Grip-Pull up", "Pull-Up", "Barbell Row", "Lat Pulldown", "Seated Cable Row", "T-Bar Row", "Single Arm DB Row", "Face Pull", "Deadlift"] },
  { muscle: "Shoulders",  keywords: ["Overhead Press", "Lateral Raise", "Front Raise", "Arnold Press", "Upright Row", "Cable Lateral Raise", "Rear Delt Fly", "DB Shoulder Press"] },
  { muscle: "Biceps",     keywords: ["Barbell Curl", "DB Curl", "Hammer Curl", "Preacher Curl", "Cable Curl", "Concentration Curl", "Incline DB Curl", "Spider Curl"] },
  { muscle: "Triceps",    keywords: ["Tricep Dip", "Skull Crusher", "Overhead Tricep Extension", "Cable Pushdown", "Close Grip Bench", "Diamond Push-Up", "Kickback"] },
  { muscle: "Quads",      keywords: ["Squat", "Leg Press", "Hack Squat", "Leg Extension", "Bulgarian Split Squat", "Lunge", "Front Squat", "Goblet Squat"] },
  { muscle: "Hamstrings", keywords: ["Romanian Deadlift", "Leg Curl", "Nordic Curl", "Good Morning", "Stiff Leg Deadlift", "Glute Ham Raise", "Sumo Deadlift"] },
  { muscle: "Glutes",     keywords: ["Hip Thrust", "Glute Bridge", "Cable Kickback", "Step Up", "Sumo Squat", "Donkey Kick", "Abductor Machine"] },
  { muscle: "Core",       keywords: ["Plank", "Crunch", "Cable Crunch", "Hanging Leg Raise", "Ab Wheel", "Russian Twist", "Decline Sit-Up", "Pallof Press"] },
  { muscle: "Calves",     keywords: ["Standing Calf Raise", "Seated Calf Raise", "Leg Press Calf Raise", "Single Leg Calf Raise", "Donkey Calf Raise"] },
];

// Flatten into {name, muscle} for quick lookup
const ALL_EXERCISES = searchQuery.flatMap(({ muscle, keywords }) =>
  keywords.map(name => ({ name, muscle }))
);

const MUSCLE_BADGE_COLORS = {
  Chest:      { bg: "rgba(239,68,68,.12)",    color: "#ef4444" },
  Back:       { bg: "rgba(59,130,246,.12)",   color: "#3b82f6" },
  Shoulders:  { bg: "rgba(249,115,22,.12)",   color: "#f97316" },
  Biceps:     { bg: "rgba(168,85,247,.12)",   color: "#a855f7" },
  Triceps:    { bg: "rgba(236,72,153,.12)",   color: "#ec4899" },
  Quads:      { bg: "rgba(234,179,8,.12)",    color: "#eab308" },
  Hamstrings: { bg: "rgba(34,197,94,.12)",    color: "#22c55e" },
  Glutes:     { bg: "rgba(20,184,166,.12)",   color: "#14b8a6" },
  Core:       { bg: "rgba(148,163,184,.12)",  color: "#94a3b8" },
  Calves:     { bg: "rgba(251,191,36,.12)",   color: "#fbbf24" },
};

// --- Chip ---
const Chip = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 99,
    border: selected ? "1.5px solid #3b82f6" : "1.5px solid #2a2a2a",
    background: selected ? "rgba(59,130,246,0.12)" : "#161616",
    color: selected ? "#3b82f6" : "#aaa",
    fontSize: 13, fontWeight: selected ? 700 : 500,
    cursor: "pointer", transition: "all 0.15s ease",
    whiteSpace: "nowrap", flexShrink: 0,
  }}>
    {label}
  </button>
);

// --- Step 1: Name & Type ---
const StepNameType = ({ data, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
    <div>
      <label style={S.label}>Workout Name</label>
      <input
        type="text" placeholder="e.g. Monday Push Day"
        value={data.name}
        onChange={e => onChange({ ...data, name: e.target.value })}
        style={S.input} autoFocus
      />
    </div>
    <div>
      <label style={S.label}>Type</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {WORKOUT_TYPES.map(t => (
          <Chip key={t} label={t} selected={data.type === t} onClick={() => onChange({ ...data, type: t })} />
        ))}
      </div>
    </div>
    <div>
      <label style={S.label}>Target Muscles</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {MUSCLE_TAGS.map(m => (
          <Chip key={m} label={m} selected={data.muscles.includes(m)}
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

// --- Exercise Card ---
const ExerciseCard = ({ exercise, onUpdate, onRemove }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={S.card}>
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
          <button onClick={() => setOpen(o => !o)} style={S.iconBtn}>{open ? "▲" : "▼"}</button>
          <button onClick={onRemove} style={{ ...S.iconBtn, color: "#ef4444" }}>✕</button>
        </div>
      </div>
      {open && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { key: "sets", label: "Sets", placeholder: "4" },
            { key: "reps", label: "Reps", placeholder: "10" },
            { key: "weight", label: "Weight", placeholder: "lbs" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <input type="number" placeholder={placeholder}
                value={exercise[key] || ""}
                onChange={e => onUpdate({ ...exercise, [key]: e.target.value })}
                style={{ ...S.input, padding: "10px 8px", textAlign: "center", fontSize: 15 }}
              />
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notes</div>
            <input type="text" placeholder="Optional note..."
              value={exercise.notes || ""}
              onChange={e => onUpdate({ ...exercise, notes: e.target.value })}
              style={{ ...S.input, fontSize: 13 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Step 2: Exercises ---
const StepExercises = ({ exercises, onUpdate }) => {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const getSuggestions = (val) => {
    if (!val.trim()) return [];
    const q = val.toLowerCase();
    return ALL_EXERCISES.filter(ex => ex.name.toLowerCase().includes(q)).slice(0, 6);
  };

  const handleQueryChange = (val) => {
    setQuery(val);
    setHighlightIdx(-1);
    setSuggestions(getSuggestions(val));
  };

  const commitExercise = (name) => {
    if (!name.trim()) return;
    onUpdate([...exercises, { id: Date.now(), name: name.trim(), sets: "", reps: "", weight: "", notes: "" }]);
    setQuery(""); setSuggestions([]); setShowAdd(false); setHighlightIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) {
      if (e.key === "Enter") commitExercise(query);
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      highlightIdx >= 0 ? commitExercise(suggestions[highlightIdx].name) : commitExercise(query);
    } else if (e.key === "Escape") {
      setSuggestions([]); setHighlightIdx(-1);
    }
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
        <ExerciseCard key={ex.id} exercise={ex}
          onUpdate={updated => onUpdate(exercises.map((e, idx) => idx === i ? updated : e))}
          onRemove={() => onUpdate(exercises.filter((_, idx) => idx !== i))}
        />
      ))}
      {showAdd ? (
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text" placeholder="Search exercises..."
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{ ...S.input, flex: 1 }}
            />
            <button onClick={() => commitExercise(query)} style={S.primaryBtn}>Add</button>
            <button onClick={() => { setShowAdd(false); setQuery(""); setSuggestions([]); }} style={S.ghostBtn}>✕</button>
          </div>
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              right: 0, background: "#1a1a1a",
              border: "1.5px solid #2a2a2a", borderRadius: 12,
              overflow: "hidden", zIndex: 50,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}>
              {suggestions.map((ex, i) => {
                const badge = MUSCLE_BADGE_COLORS[ex.muscle] || { bg: "#222", color: "#888" };
                const isHighlighted = i === highlightIdx;
                return (
                  <div
                    key={ex.name}
                    onMouseDown={() => commitExercise(ex.name)}
                    onMouseEnter={() => setHighlightIdx(i)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px",
                      background: isHighlighted ? "#242424" : "transparent",
                      borderBottom: i < suggestions.length - 1 ? "1px solid #222" : "none",
                      cursor: "pointer", transition: "background 0.1s ease",
                    }}
                  >
                    <span style={{ color: "#f0f0f0", fontSize: 14, fontWeight: isHighlighted ? 600 : 400 }}>
                      {ex.name}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                      background: badge.bg, color: badge.color, flexShrink: 0, marginLeft: 10,
                    }}>
                      {ex.muscle}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} style={S.addExerciseBtn}>+ Add Exercise</button>
      )}
    </div>
  );
};

// --- Step 3: Review ---
const StepReview = ({ data, exercises, isEditing }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={S.card}>
      <div style={{ fontSize: 11, color: isEditing ? "#f59e0b" : "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        {isEditing ? "Editing Workout" : "Overview"}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{data.name || "Untitled Workout"}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {data.type && <span style={S.badge}>{data.type}</span>}
        {data.muscles.map(m => <span key={m} style={{ ...S.badge, background: "rgba(99,102,241,0.12)", color: "#818cf8", borderColor: "rgba(99,102,241,0.25)" }}>{m}</span>)}
      </div>
    </div>
    <div style={{ fontSize: 11, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", paddingLeft: 4 }}>
      {exercises.length} Exercise{exercises.length !== 1 ? "s" : ""}
    </div>
    {exercises.map((ex) => (
      <div key={ex.id} style={{ ...S.card, padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#f0f0f0" }}>{ex.name}</div>
          <div style={{ display: "flex", gap: 12 }}>
            {ex.sets && <span style={S.statChip}>{ex.sets} sets</span>}
            {ex.reps && <span style={S.statChip}>{ex.reps} reps</span>}
            {ex.weight && <span style={{ ...S.statChip, color: "#3b82f6" }}>{ex.weight} lbs</span>}
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

// --- Main ---
export default function CreateWorkout({ isLoadingWorkout, initialData, onSave, onCancel }) {
  const isEditing = !!initialData;

  const [step, setStep]           = useState(0);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [workoutData, setWorkoutData] = useState({ name: "", type: "", muscles: [] });
  const [exercises, setExercises] = useState([]);
  const [draftLoaded, setDraftLoaded] = useState(false); // flag to prevent save before draft loads

  // Load initialData (edit mode) OR draft (new mode)
  useEffect(() => {
    if (isEditing) {
      setWorkoutData({ name: initialData.name, type: initialData.type, muscles: initialData.muscles || [] });
      setExercises(initialData.exercises || []);
    } else {
      const draft = localStorage.getItem('workoutDraft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setWorkoutData(parsed.workoutData || { name: "", type: "", muscles: [] });
          setExercises(parsed.exercises || []);
        } catch (error) {
          console.error("Failed to parse workout draft:", error);
          setWorkoutData({ name: "", type: "", muscles: [] });
          setExercises([]);
        }
      }
    }
    setDraftLoaded(true);
  }, [isEditing, initialData]);

  // Auto-save draft only in create mode (and only after initial load)
  useEffect(() => {
    if (!isEditing && draftLoaded) {
      try {
        localStorage.setItem('workoutDraft', JSON.stringify({ workoutData, exercises }));
      } catch (error) {
        console.error("Failed to save workout draft:", error);
      }
    }
  }, [workoutData, exercises, isEditing, draftLoaded]);

  const canNext = () => {
    if (step === 0) return workoutData.name.trim().length > 0 && workoutData.type;
    if (step === 1) return exercises.length > 0;
    return true;
  };

  const navigate = (dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setStep(s => s + dir); setAnimating(false); }, 220);
  };

  const handleSave = () => {
    const payload = { ...workoutData, exercises };
    console.log('[CreateWorkout] handleSave calling onSave with:', payload);
    onSave?.(payload);
    console.log('[CreateWorkout] onSave callback completed');
    localStorage.removeItem('workoutDraft');
  };

  if (!isLoadingWorkout) return null;

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={S.title}>
            {isEditing
              ? <><span style={{ color: "#f59e0b" }}>Edit</span> Workout</>
              : <>Create <span style={{ color: "#3b82f6" }}>Your</span> Workout</>
            }
          </h1>
          {onCancel && (
            <button onClick={onCancel} style={{
              background: "none", border: "1px solid #2a2a2a", borderRadius: 8,
              color: "#666", fontSize: 13, fontWeight: 700, padding: "6px 14px",
              cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
          )}
        </div>
        {/* Progress bar — swap mock for your real <ProgressBar /> */}
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {STEPS[step].label}
            </span>
            <span style={{ fontSize: 11, color: isEditing ? "#f59e0b" : "#3b82f6", fontWeight: 700 }}>
              {STEPS[step].progress}%
            </span>
          </div>
          <div style={{ background: "#1f1f1f", borderRadius: 99, height: 3 }}>
            <div style={{
              background: isEditing
                ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                : "linear-gradient(90deg, #3b82f6, #6366f1)",
              borderRadius: 99, height: 3,
              width: `${STEPS[step].progress}%`,
              transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)"
            }} />
          </div>
        </div>
        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 99,
              background: i === step
                ? (isEditing ? "#f59e0b" : "#3b82f6")
                : i < step ? "#6366f1" : "#2a2a2a",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 20px 0",
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${direction * 24}px)` : "translateX(0)",
        transition: animating ? "none" : "opacity 0.2s ease, transform 0.2s ease",
      }}>
        {step === 0 && <StepNameType data={workoutData} onChange={setWorkoutData} />}
        {step === 1 && <StepExercises exercises={exercises} onUpdate={setExercises} />}
        {step === 2 && <StepReview data={workoutData} exercises={exercises} isEditing={isEditing} />}
      </div>

      {/* Bottom Nav */}
      <div style={S.bottomNav}>
        {step > 0
          ? <button onClick={() => navigate(-1)} style={S.backBtn}>← Back</button>
          : <div />
        }
        {step < STEP_COUNT - 1 ? (
          <button onClick={() => canNext() && navigate(1)} disabled={!canNext()}
            style={{ ...S.nextBtn, opacity: canNext() ? 1 : 0.35 }}>
            Next →
          </button>
        ) : (
          <button onClick={() => { console.log('[CreateWorkout] Save button clicked'); handleSave(); }} style={{
            ...S.saveBtn,
            background: isEditing
              ? "linear-gradient(135deg, #f59e0b, #ef4444)"
              : "linear-gradient(135deg, #3b82f6, #6366f1)",
          }}>
            {isEditing ? "Save Changes ✓" : "Save Workout ✓"}
          </button>
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const S = {
  root: {
    display: "flex", flexDirection: "column",
    height: "100vh", width: "100vw",
    background: "#0f0f0f", color: "#f0f0f0",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    margin: 0, padding: 0, overflow: "hidden",
    position: "fixed", top: 0, left: 0, zIndex: 999,
  },
  header: {
    padding: "52px 20px 16px",
    background: "#0f0f0f",
    borderBottom: "1px solid #1a1a1a",
    flexShrink: 0,
  },
  title: { fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.02em", color: "#fff" },
  label: { fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 },
  input: {
    width: "100%", background: "#161616", border: "1.5px solid #2a2a2a",
    borderRadius: 10, color: "#f0f0f0", fontSize: 15, padding: "13px 14px",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s ease",
  },
  card: { background: "#161616", borderRadius: 12, padding: "16px", border: "1px solid #222" },
  iconBtn: { background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, padding: "4px 8px", borderRadius: 6 },
  addExerciseBtn: {
    width: "100%", padding: "14px", background: "transparent",
    border: "1.5px dashed #2a2a2a", borderRadius: 12,
    color: "#3b82f6", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em",
  },
  primaryBtn: {
    padding: "13px 20px", background: "#3b82f6", border: "none", borderRadius: 10,
    color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
  },
  ghostBtn: {
    padding: "13px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a",
    borderRadius: 10, color: "#888", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  },
  badge: {
    padding: "4px 10px", background: "rgba(59,130,246,0.1)", color: "#3b82f6",
    border: "1px solid rgba(59,130,246,0.2)", borderRadius: 99, fontSize: 12, fontWeight: 600,
  },
  statChip: { fontSize: 12, color: "#666", fontWeight: 600 },
  bottomNav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px 32px", borderTop: "1px solid #1a1a1a",
    background: "#0f0f0f", flexShrink: 0, gap: 12,
  },
  backBtn: {
    padding: "13px 20px", background: "#161616", border: "1px solid #2a2a2a",
    borderRadius: 12, color: "#aaa", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  },
  nextBtn: {
    padding: "13px 28px", background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 800,
    cursor: "pointer", letterSpacing: "-0.01em", fontFamily: "inherit", transition: "opacity 0.2s ease",
  },
  saveBtn: {
    flex: 1, padding: "15px 28px", border: "none", borderRadius: 12,
    color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em",
  },
};