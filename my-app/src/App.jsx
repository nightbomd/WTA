import { useState, useEffect } from 'react'
import ProgressBar from './Components/progressBar'
import './App.css'
import DonutComponent from './Components/donut'
import Button from "./Components/btn"
import CreateWorkout from './Components/createWorkout'
import Inquiry from './Components/inquiry'
import SignUp from "./Components/signUp"
import Icon from "./Components/icon"
import MobileNavbar from "./Components/mobileNavbar"
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from "./firebase.js";
import { deleteField, doc, getDoc, setDoc } from "firebase/firestore";






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
const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const TYPE_COLORS = {
  Push: { bg: 'var(--span-red)', color: 'var(--color-red)' },
  Pull: { bg: 'rgba(59,130,246,.15)', color: 'var(--color-blue)' },
  Legs: { bg: 'rgba(168,85,247,.15)', color: '#a855f7' },
  Upper: { bg: 'rgba(234,179,8,.15)', color: 'var(--color-yellow)' },
  Lower: { bg: 'rgba(34,197,94,.15)', color: 'var(--color-green)' },
  'Full Body': { bg: 'rgba(249,115,22,.15)', color: '#f97316' },
  Cardio: { bg: 'rgba(236,72,153,.15)', color: '#ec4899' },
  Custom: { bg: 'rgba(148,163,184,.15)', color: '#94a3b8' },
};

const typeStyle = (type) =>
  TYPE_COLORS[type] || { bg: 'rgba(148,163,184,.15)', color: '#94a3b8' };

const getLocalInquiryData = () => {
  try {
    const saved = localStorage.getItem('inquiryData');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Failed to load inquiry data:", error);
    return {};
  }
};

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
          <span className="text-light fw-semibold text-truncate workout-history-name">
            {workout.name}
          </span>

        </div>
        <div className="d-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
          <span className="text-secondary" style={{ fontSize: 14 }}>
            {workout.exercises?.length || 0} ex
          </span>
          <span style={{ color: '#444', fontSize: 12 }}><Icon name={open ? "chevron-up" : "chevron-down"} size={12} /></span>
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

function MainLoad({ fade }) {
  return <>
    <div className={`loader ${fade ? 'fade-out' : ''}`} style={{ background: "black", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src={`${import.meta.env.BASE_URL}app-logo.png`} alt="Logo"></img>
    </div>

  </>;
}

const histStyles = {
  editBtn: {
    padding: '8px 18px', background: 'rgba(95, 139, 210, 0.07)',
    border: '1px solid rgba(59,130,246,.25)', borderRadius: 10,
    color: '#71a5f9ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  deleteBtn: {
    padding: '8px 18px', background: 'rgba(239, 68, 68, 0.03)',
    border: '1px solid rgba(239,68,68,.2)', borderRadius: 10,
    color: '#a6301dff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
};


// --- Main App ---
function App() {
  const today = toLocalDateStr(new Date());
  console.log(today);
  const [workoutLog, setWorkoutLog] = useState([]);       // all saved workouts
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null); // workout being edited
  const [selectedDate, setSelectedDate] = useState(today);
  const [isRegistered, setIsRegistering] = useState(() => Object.keys(getLocalInquiryData()).length > 0);
  const [inquiryData, setInquiryData] = useState(getLocalInquiryData);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const [user, setUser] = useState(null);
  const [openSignUp, setOpenSignUp] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [workoutsLoadedForUser, setWorkoutsLoadedForUser] = useState(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);

      setTimeout(() => {
        setLoading(false);
      }, 500); // fade duration
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    console.log(auth.currentUser)
  }, [auth.currentUser])


  useEffect(() => {
    if (!user) {
      setWorkoutsLoadedForUser(null);
      return;
    }

    let cancelled = false;
    setWorkoutsLoadedForUser(null);

    const fetchUserData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (cancelled) return;

        if (docSnap.exists()) {
          const saved = docSnap.data();
          const savedInquiry = saved.inquiryData || {};
          setInquiryData(savedInquiry);
          setIsRegistering(Object.keys(savedInquiry).length > 0);
          setWorkoutLog(Array.isArray(saved.workoutLog) ? saved.workoutLog : []);
        } else {
          setIsRegistering(false);
          setWorkoutLog([]);
        }

        setWorkoutsLoadedForUser(user.uid);
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching user data:", error);
        setIsRegistering(false);
        setWorkoutLog([]);
      }
    };

    fetchUserData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || isGuestMode || workoutsLoadedForUser !== user.uid) return;

    const saveWorkoutLog = async () => {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          { workoutLog },
          { merge: true }
        );
      } catch (error) {
        console.error("Failed to save workout log:", error);
      }
    };

    saveWorkoutLog();
  }, [workoutLog, user, isGuestMode, workoutsLoadedForUser]);

  const clearWorkoutDraft = async () => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { workoutDraft: deleteField() },
        { merge: true }
      );
    } catch (error) {
      console.error("Failed to clear workout draft:", error);
    }
  };

  const handleSave = (workout) => {
    if (editingWorkout) {
      setWorkoutLog(prev =>
        prev.map(w => w.id === editingWorkout.id ? { ...workout, id: w.id, date: w.date } : w)
      );
    } else {
      const newWorkout = { ...workout, id: Date.now(), date: today };
      setWorkoutLog(prev => [...prev, newWorkout]);
    }
    setEditingWorkout(null);
    setIsLoadingWorkout(false);
    clearWorkoutDraft();
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
    clearWorkoutDraft();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsGuestMode(false);
      setOpenSignUp(true);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleContinueWithoutAccount = () => {
    const savedInquiryData = getLocalInquiryData();
    setInquiryData(savedInquiryData);
    setIsRegistering(Object.keys(savedInquiryData).length > 0);
    setIsGuestMode(true);
    setWorkoutLog([]);
  };

  const handleSignedIn = () => {
    setWorkoutLog([]);
    setWorkoutsLoadedForUser(null);
    setIsGuestMode(false);
  };

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User UID:", user.uid);
      setUser(user);
    } else {
      console.log("No user");
      setUser(null);
    }
  });

  return unsubscribe;
}, []);


console.log(inquiryData);

  // Workouts for the selected date
  const workoutsOnDate = workoutLog.filter(w => w.date === selectedDate);
  // Primary displayed workout (first one on that date, could extend to multiple later)
  const displayWorkout = workoutsOnDate[0] || null;
  console.log(displayWorkout)
  const isToday = selectedDate === today;

  if (!isRegistered && (user || !openSignUp)) {
  return <Inquiry setIsRegistering={setIsRegistering} setInquiryData={setInquiryData} />;
}

// Show SignUp ONLY if explicitly opened AND user isn't signed in
if (openSignUp && !user) {
  return <SignUp setUser={setUser} openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} onContinueWithoutAccount={handleContinueWithoutAccount} onSignedIn={handleSignedIn} />;
}

  return (
    <>
      {loading && <MainLoad fade={fade} />}
      <div style={{ background: 'var(--bg-color)' }} className="container-fluid app-shell">

        {/* ── Header ── */}
        <div className="row g-4 p-4">
          <header className="row w-100 g-4">
            {!isLoadingWorkout && (
              <div className="col-sm-12 col-md-6">
                <h1 className="mb-0 app-greeting">
                  <span className="text-light app-greeting__label">Welcome,</span>
                  <span className="app-greeting__name" style={{ color: 'var(--color-blue)' }}>{inquiryData.name}</span>
                </h1>
              </div>
            )}
            <div className="create-workout col-sm-12 col-md-6 gap-3 d-flex flex-column justify-content-start">
              {!isLoadingWorkout && (
                <>
                  {!displayWorkout && isToday && (
                    <p className="fs-5 text-secondary mb-2 dashboard-status">No workout logged today. Log one to start!</p>
                  )}
                  <Button
                    text={isToday ? 'Log Workout' : `Log for ${formatDisplayDate(selectedDate)}`}
                    onClick={() => { setEditingWorkout(null); setIsLoadingWorkout(true); }}
                    className="mb-2"
                  />
                  {user && (
                    <Button text="Sign Out" bg="#282f36ff" onClick={handleSignOut} />
                  )}
                  {!user && (
                    <>
                     <div className="d-flex flex-row"><p className="fs-5 text-secondary mb-2 account-warning"><span className="warning-icon"><Icon name="alert" size={20} /></span>Current workouts are not saved. Create an account to save workouts.</p></div>
                      <Button text="Create Account" border="#3a9ad9ff" color="#3a9ad9ff" bg="#2564b70b" transparency={0.2} onClick={() => setOpenSignUp(true)} />

                    </>
                  )}
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
                <div className="d-flex text-secondary align-items-center gap-3 flex-wrap">
                  <span className="filter-label" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                  <span className="text-secondary filter-date" style={{ fontSize: 12 }}>
                    {formatDisplayDate(selectedDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Main Cards ── */}
            <div className="row g-4 px-4 pb-4">

              {/* Today's Workout Card */}
              <div style={{ background: 'var(--card-bg)' }} className="card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
                <p className="card-eyebrow card-eyebrow--workout">
                  {isToday ? "Today's workout" : formatDisplayDate(selectedDate)}
                </p>

                {displayWorkout ? (
                  <>
                    <h2 className="d-flex align-items-center gap-2 flex-wrap workout-heading">
                      {displayWorkout.name}
                      <span className="px-2 py-1 fs-5 rounded-4"
                        style={{ fontSize: 13, ...typeStyle(displayWorkout.type) }}>
                        {displayWorkout.type}
                      </span>
                      {displayWorkout.day && (
                        <span style={{ background: "rgba(241, 187, 99, 0.12)", color: "#f8bd81ff", border: "1px solid rgba(241, 187, 99, 0.25)", borderRadius: '99px', fontSize: 13, padding: '4px 12px', fontWeight: 600 }}>
                          {formatDisplayDate(selectedDate)}
                        </span>
                      )}
                    </h2>
                    {displayWorkout.muscles?.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {displayWorkout.muscles.map(m => (
                          <span key={m} style={{
                            fontSize: 12, fontWeight: 600, padding: '3px 10px',
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
                              <span className="today-exercise-name">{exercise.name}</span>
                              <span className="today-exercise-details">
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
                    <span className="today-workout-empty">
                      No workout logged{isToday ? ' today' : ' on this date'}.
                    </span>
                  </div>
                )}
                <div className="streak-calendar mt-4">
                  <span className="streak-label">Streak:</span>{' '}
                  <span className="streak-value">None</span>
                  {/* calendar goes here */}
                </div>
              </div>

              {/* Weekly Volume Card */}
              <div style={{ background: 'var(--card-bg)' }} className="card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
                <h2 className="text-light section-heading">Weekly Volume <span className="section-heading__detail">({inquiryData.workoutDaysPerWeek} days)</span></h2>
                {displayWorkout?.exercises?.length > 0 ? (
                  <div className="exercise-table">
                    <table className="table table-dark table-borderless mb-0" style={{ background: 'transparent' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #222' }}>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Exercise</th>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sets</th>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reps</th>
                          <th style={{ color: '#666', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayWorkout.exercises.map((exercise, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ color: '#e0e0e0' }}>{exercise.name}</td>
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
                <h2 className="text-light section-heading">Calorie Tracker</h2>
                <DonutComponent value={2120} bg="var(--color-blue)" />
                <div className="protein">
                  <h3 className="text-light metric-heading">Protein: <strong>150g</strong></h3>
                  <ProgressBar text="72/150g" value={75} bg="var(--color-red)" />
                </div>
                <div className="carbs">
                  <h3 className="text-light metric-heading">Carbs: <strong>200g</strong></h3>
                  <ProgressBar text="150/200g" value={65} bg="var(--color-yellow)" />
                </div>
                <div className="carbs">
                  <h3 className="text-light metric-heading">Fats: <strong>48g</strong></h3>
                  <ProgressBar text="16/48g" value={32} bg="var(--color-green)" />
                </div>
              </div>
              <div style={{ background: 'var(--card-bg)' }} className="col-sm-12 col-md-6 col-lg-6 rounded-5 p-4">
                <h2 className="text-light section-heading">Stats</h2>
                <div className="row justify-content-center g-3">
                  <div className="col-12 col-md-4">
                    <div style={{ backgroundColor: '#332E2E' }} className="p-4 rounded-5 text-center h-100">
                      <p className="fs-1 fw-bold mb-1 stat-value" style={{ color: 'var(--color-blue)' }}>{inquiryData.weight || '—'}kg</p>
                      <span className="text-secondary d-block stat-label">Weight</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div style={{ backgroundColor: '#332E2E' }} className="p-4 rounded-5 text-center h-100">
                      <p className="fs-1 fw-bold mb-1 stat-value" style={{ color: 'var(--color-blue)' }}>15%</p>
                      <span className="text-secondary d-block stat-label">Body Fat</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div style={{ backgroundColor: '#332E2E' }} className="p-4 rounded-5 text-center h-100">
                      <p className="fs-1 fw-bold mb-1 stat-value" style={{ color: 'var(--color-blue)' }}>Sep 1</p>
                      <span className="text-secondary d-block stat-label">Deadline</span>
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
                    <h2 className="text-light section-heading mb-0">Workout History</h2>
                    <span className="history-count" style={{
                      fontSize: 12, fontWeight: 700, color: '#555',
                      background: '#1a1a1a', border: '1px solid #2a2a2a',
                      borderRadius: 99, padding: '4px 12px'
                    }}>
                      {workoutLog.length} total
                    </span>
                  </div>

                  {workoutLog.length === 0 ? (
                    <div className="text-center py-4">
                      <div style={{ fontSize: 32, marginBottom: 10 }}><Icon name="clipboard" size={32} /></div>
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
                        <div className="history-date-label" style={{
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

      {!isLoadingWorkout && <MobileNavbar />}

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
