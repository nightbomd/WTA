import { useState, useEffect } from 'react'
import ProgressBar from './Components/progressBar'
import './App.css'
import DonutComponent from './Components/donut'
import Button from "./Components/btn"
import CreateWorkout from './Components/createWorkout'

// --- Helpers ---
// Returns YYYY-MM-DD in LOCAL time (not UTC)
const toLocalDateStr = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatDisplayDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });
};

const TYPE_COLORS = {
  Push:      { bg: 'var(--span-red)',    color: 'var(--color-red)' },
  Pull:      { bg: 'rgba(59,130,246,.15)', color: 'var(--color-blue)' },
  Legs:      { bg: 'rgba(168,85,247,.15)', color: '#a855f7' },
  Upper:     { bg: 'rgba(234,179,8,.15)',  color: 'var(--color-yellow)' },
  Lower:     { bg: 'rgba(34,197,94,.15)',  color: 'var(--color-green)' },
  'Full Body': { bg: 'rgba(249,115,22,.15)', color: '#f97316' },
  Cardio:    { bg: 'rgba(236,72,153,.15)', color: '#ec4899' },
  Custom:    { bg: 'rgba(148,163,184,.15)', color: '#94a3b8' },
};

const typeStyle = (type) =>
  TYPE_COLORS[type] || { bg: 'rgba(148,163,184,.15)', color: '#94a3b8' };


// --- Workout History Card ---
const WorkoutHistoryCard = ({ workout, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ts = typeStyle(workout.type);
  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: 16,
      border: '1px solid #222',
      overflow: 'hidden',
      transition: 'border-color 0.15s ease',
    }}>
      {/* Header row */}
      <div
        className="d-flex align-items-center justify-content-between p-3"
        style={{ cursor: 'pointer', gap: 12 }}
        onClick={() => setOpen(o => !o)}
      >
        <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
          <span className="px-2 py-1 rounded-4 text-nowrap"
            style={{ fontSize: 11, fontWeight: 700, background: ts.bg, color: ts.color, flexShrink: 0 }}>
            {workout.type}
          </span>
          <span className="text-light fw-semibold text-truncate" style={{ fontSize: 15 }}>
            {workout.name}
          </span>
        </div>
        <div className="d-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
          <span className="text-secondary" style={{ fontSize: 12 }}>
            {workout.exercises?.length || 0} ex
          </span>
          <span style={{ color: '#444', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded exercises */}
      {open && (
        <div style={{ borderTop: '1px solid #1e1e1e' }}>
          <div className="px-3 pt-3 pb-2">
            {workout.exercises?.map((ex, i) => (
              <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-light" style={{ fontSize: 14 }}>{ex.name}</span>
                <span className="text-secondary" style={{ fontSize: 12 }}>
                  {[ex.sets && `${ex.sets} sets`, ex.reps && `${ex.reps} reps`, ex.weight && `${ex.weight} lbs`]
                    .filter(Boolean).join(' · ')}
                </span>
              </div>
            ))}
          </div>
          <div className="d-flex gap-2 px-3 pb-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(workout); }}
              style={histStyles.editBtn}>
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(workout.id); }}
              style={histStyles.deleteBtn}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const histStyles = {
  editBtn: {
    padding: '8px 18px', background: 'rgba(59,130,246,.12)',
    border: '1px solid rgba(59,130,246,.25)', borderRadius: 10,
    color: '#3b82f6', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  deleteBtn: {
    padding: '8px 18px', background: 'rgba(239,68,68,.08)',
    border: '1px solid rgba(239,68,68,.2)', borderRadius: 10,
    color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
};


// --- Main App ---
function App() {
  const today = toLocalDateStr(new Date());

  const [workoutLog, setWorkoutLog]       = useState([]);       // all saved workouts
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout]     = useState(null); // workout being edited
  const [selectedDate, setSelectedDate]         = useState(today);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('workoutLog');
    if (stored) setWorkoutLog(JSON.parse(stored));
  }, []);

  // Persist any time workoutLog changes
  useEffect(() => {
    localStorage.setItem('workoutLog', JSON.stringify(workoutLog));
  }, [workoutLog]);

  const handleSave = (workout) => {
    if (editingWorkout) {
      // Update existing entry, keep its original date
      setWorkoutLog(prev =>
        prev.map(w => w.id === editingWorkout.id ? { ...workout, id: w.id, date: w.date } : w)
      );
    } else {
      // New workout — stamp with today's local date
      const newWorkout = { ...workout, id: Date.now(), date: today };
      setWorkoutLog(prev => [...prev, newWorkout]);
    }
    setEditingWorkout(null);
    setIsLoadingWorkout(false);
    localStorage.removeItem('workoutDraft');
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setIsLoadingWorkout(true);
  };

  const handleDelete = (id) => {
    setWorkoutLog(prev => prev.filter(w => w.id !== id));
  };

  const handleCancel = () => {
    setEditingWorkout(null);
    setIsLoadingWorkout(false);
    localStorage.removeItem('workoutDraft');
  };

  // Workouts for the selected date
  const workoutsOnDate = workoutLog.filter(w => w.date === selectedDate);
  // Primary displayed workout (first one on that date, could extend to multiple later)
  const displayWorkout = workoutsOnDate[0] || null;

  const isToday = selectedDate === today;

  return (
    <>
      <div style={{ background: 'var(--bg-color)' }} className="container-fluid">

        {/* ── Header ── */}
        <div className="row g-4 p-4">
          <header className="row w-100 g-4">
            {!isLoadingWorkout && (
              <div className="col-sm-12 col-md-6">
                <h1 className="mb-0" style={{ fontSize: 'var(--font-size-header)' }}>
                  <span className="text-light">Welcome,</span><br />
                  <span style={{ color: 'var(--color-blue)' }}>Marcus!</span>
                </h1>
              </div>
            )}
            <div className="create-workout col-sm-12 col-md-6 d-flex flex-column justify-content-start">
              {!isLoadingWorkout && (
                <>
                  {!displayWorkout && isToday && (
                    <p className="fs-5 text-secondary mb-2">No workout logged today.</p>
                  )}
                  <Button
                    text={isToday ? 'Log Workout' : `Log for ${formatDisplayDate(selectedDate)}`}
                    onClick={() => { setEditingWorkout(null); setIsLoadingWorkout(true); }}
                  />
                </>
              )}
            </div>
          </header>
        </div>

        {!isLoadingWorkout && (
          <main className="container-fluid">

            {/* ── Date Filter ── */}
            <div className="row px-4 pb-3">
              <div className="col-12">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Filter by Date
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    max={today}
                    onChange={e => setSelectedDate(e.target.value)}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1.5px solid #2a2a2a',
                      borderRadius: 10,
                      color: '#f0f0f0',
                      fontSize: 14,
                      padding: '8px 12px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      colorScheme: 'dark',
                    }}
                  />
                  {!isToday && (
                    <button
                      onClick={() => setSelectedDate(today)}
                      style={{
                        background: 'rgba(59,130,246,.1)',
                        border: '1px solid rgba(59,130,246,.25)',
                        borderRadius: 8,
                        color: '#3b82f6',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '8px 14px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}>
                      Back to Today
                    </button>
                  )}
                  <span style={{ fontSize: 13, color: '#555' }}>
                    {formatDisplayDate(selectedDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Main Cards ── */}
            <div className="row g-4 px-4 pb-4">

              {/* Today's Workout Card */}
              <div style={{ background: 'var(--card-bg)' }} className="card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
                <p className="text-secondary mb-1" style={{ fontSize: 13 }}>
                  {isToday ? "Today's workout" : formatDisplayDate(selectedDate)}
                </p>

                {displayWorkout ? (
                  <>
                    <h2 className="text-light d-flex align-items-center gap-2 flex-wrap mb-3">
                      {displayWorkout.name}
                      <span className="px-2 py-1 rounded-4"
                        style={{ fontSize: 13, ...typeStyle(displayWorkout.type) }}>
                        {displayWorkout.type}
                      </span>
                    </h2>
                    {displayWorkout.muscles?.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {displayWorkout.muscles.map(m => (
                          <span key={m} style={{
                            fontSize: 11, fontWeight: 600, padding: '3px 10px',
                            background: 'rgba(99,102,241,.12)', color: '#818cf8',
                            border: '1px solid rgba(99,102,241,.2)', borderRadius: 99,
                          }}>{m}</span>
                        ))}
                      </div>
                    )}
                    <ProgressBar
                      text={`${displayWorkout.exercises?.length || 0} exercises`}
                      value={100}
                      bg="var(--color-blue)"
                    />
                    <div className="exercise-list text-light mt-3">
                      <ul className="list-unstyled mb-0">
                        {displayWorkout.exercises?.map((exercise, idx) => (
                          <li key={idx} className="d-flex align-items-center mb-3">
                            <i className="bi bi-check-circle me-3"
                              style={{ fontSize: '2rem', color: '#2264c6' }} />
                            <div className="d-flex flex-column">
                              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{exercise.name}</span>
                              <span className="text-secondary" style={{ fontSize: 13 }}>
                                {[exercise.sets && `${exercise.sets} sets`,
                                  exercise.reps && `${exercise.reps} reps`,
                                  exercise.weight && `@ ${exercise.weight} lbs`
                                ].filter(Boolean).join(' · ')}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={() => handleEdit(displayWorkout)} style={histStyles.editBtn}>
                      Edit Workout
                    </button>
                  </>
                ) : (
                  <div className="d-flex flex-column align-items-start gap-2 mt-2">
                    <span className="text-secondary" style={{ fontSize: 15 }}>
                      No workout logged{isToday ? ' today' : ' on this date'}.
                    </span>
                  </div>
                )}
              </div>

              {/* Weekly Volume Card */}
              <div style={{ background: 'var(--card-bg)' }} className="card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
                <h2 className="text-light mb-3">Weekly Volume</h2>
                {displayWorkout?.exercises?.length > 0 ? (
                  <div className="exercise-table">
                    <table className="table table-dark table-borderless mb-0" style={{ background: 'transparent' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #222' }}>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: 0 }}>Exercise</th>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sets</th>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reps</th>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayWorkout.exercises.map((exercise, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ color: '#e0e0e0', paddingLeft: 0 }}>{exercise.name}</td>
                            <td style={{ color: '#e0e0e0' }}>{exercise.sets || '—'}</td>
                            <td style={{ color: '#e0e0e0' }}>{exercise.reps || '—'}</td>
                            <td style={{ color: exercise.weight ? '#3b82f6' : '#444' }}>
                              {exercise.weight ? `${exercise.weight} lbs` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-secondary">No workout data for this date.</p>
                )}
              </div>
            </div>

            {/* ── Calorie + Stats ── */}
            <div className="row g-4 px-4 pb-4">
              <div style={{ background: 'var(--card-bg)' }} className="col-sm-12 col-md-6 col-lg-6 calorie-tracker rounded-5 p-4">
                <h2 className="text-light">Calorie Tracker</h2>
                <DonutComponent value={2120} bg="var(--color-blue)" />
                <div className="protein">
                  <h3 className="text-light">Protein: 150g</h3>
                  <ProgressBar text="72/150g" value={75} bg="var(--color-red)" />
                </div>
                <div className="carbs">
                  <h3 className="text-light">Carbs: 200g</h3>
                  <ProgressBar text="150/200g" value={65} bg="var(--color-yellow)" />
                </div>
                <div className="carbs">
                  <h3 className="text-light">Fats: 48g</h3>
                  <ProgressBar text="16/48g" value={32} bg="var(--color-green)" />
                </div>
              </div>
              <div style={{ background: 'var(--card-bg)' }} className="col-sm-12 col-md-6 col-lg-6 rounded-5 p-4">
                <h2 className="text-light fs-1 mb-3">Stats</h2>
                <div className="row justify-content-center g-3">
                  <div className="col-12 col-md-4">
                    <div style={{ backgroundColor: '#332E2E' }} className="p-4 rounded-5 text-center h-100">
                      <p className="fs-1 fw-bold mb-1" style={{ color: 'var(--color-blue)' }}>175LBS</p>
                      <span className="text-secondary d-block">Weight</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div style={{ backgroundColor: '#332E2E' }} className="p-4 rounded-5 text-center h-100">
                      <p className="fs-1 fw-bold mb-1" style={{ color: 'var(--color-blue)' }}>15%</p>
                      <span className="text-secondary d-block">Body Fat</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div style={{ backgroundColor: '#332E2E' }} className="p-4 rounded-5 text-center h-100">
                      <p className="fs-1 fw-bold mb-1" style={{ color: 'var(--color-blue)' }}>Sep 1</p>
                      <span className="text-secondary d-block">Deadline</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Workout History ── */}
            <div className="row g-4 px-4 pb-5">
              <div className="col-12">
                <div style={{ background: 'var(--card-bg)' }} className="rounded-5 p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h2 className="text-light mb-0">Workout History</h2>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: '#555',
                      background: '#1a1a1a', border: '1px solid #2a2a2a',
                      borderRadius: 99, padding: '4px 12px'
                    }}>
                      {workoutLog.length} total
                    </span>
                  </div>

                  {workoutLog.length === 0 ? (
                    <div className="text-center py-4">
                      <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                      <p className="text-secondary mb-0">No workouts logged yet. Get after it.</p>
                    </div>
                  ) : (
                    // Group by date descending
                    Object.entries(
                      [...workoutLog]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .reduce((acc, w) => {
                          acc[w.date] = acc[w.date] || [];
                          acc[w.date].push(w);
                          return acc;
                        }, {})
                    ).map(([date, workouts]) => (
                      <div key={date} className="mb-4">
                        <div style={{
                          fontSize: 11, fontWeight: 700, color: date === today ? '#3b82f6' : '#555',
                          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
                          paddingBottom: 8, borderBottom: '1px solid #1e1e1e',
                        }}>
                          {date === today ? '● Today — ' : ''}{formatDisplayDate(date)}
                        </div>
                        <div className="d-flex flex-column gap-2">
                          {workouts.map(w => (
                            <WorkoutHistoryCard
                              key={w.id}
                              workout={w}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </main>
        )}
      </div>

      {/* ── CreateWorkout overlay ── */}
      {isLoadingWorkout && (
        <CreateWorkout
          isLoadingWorkout={isLoadingWorkout}
          initialData={editingWorkout}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

export default App;