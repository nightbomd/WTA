import { useState } from 'react'
import ProgressBar from './Components/progressBar'
import './App.css'
import DonutComponent from './Components/donut'
import Button from "./Components/btn"
import CreateWorkout from './Components/createWorkout'

function App() {
  const [workoutCreated, setWorkoutCreated] = useState(false);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false);
  const [savedWorkout, setSavedWorkout] = useState(null);

  const handleSave = (workout) => {
    setSavedWorkout(workout);
    setIsLoadingWorkout(false);
    setWorkoutCreated(true);
  };

  return (
    <>
      <div style={{ background: 'var(--bg-color)' }} className="p-5">
        <header className="row">
          {!isLoadingWorkout && (
          <div className="col-sm-12 col-md-6">
            <h1 className="mb-5" style={{ fontSize: 'var(--font-size-header)' }}><span className="text-light mb-4">Welcome,</span> <br /><span style={{ color: 'var(--color-blue)' }}>Marcus!</span></h1>
          </div>)}
          <div className="create-workout col-sm-12 col-md-6">
            {/* Conditionally render the entire block only if workoutCreated is false */}
            {!workoutCreated && (
              <>
                <p className="fs-1 text-light">No workout Currently</p>
                <Button text="Create a workout" onClick={() => { setWorkoutCreated(true); setIsLoadingWorkout(true); }} />
              </>
            )}
          </div>
        </header>
        {!isLoadingWorkout && (
          <main>
            <div className="row g-5">
              <div style={{ background: 'var(--card-bg)' }} className=" card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
                <p className="text-secondary">Today's workout:</p>
              <h2 className="text-light">{savedWorkout?.name || 'No Workout'}: <span className="p-2 rounded-5" style={{ background: "var(--span-red)", color: "var(--color-red)" }}>{savedWorkout?.type || 'N/A'}</span></h2>
              {savedWorkout?.exercises && (
                <ProgressBar text={`${savedWorkout.exercises.length}/${savedWorkout.exercises.length} exercises`} value={100} bg="var(--color-blue)" />
              )}
              {savedWorkout?.exercises && (
                <div className="exercise-list text-light">
                  <ul className="list-unstyled">
                    {savedWorkout.exercises.map((exercise, idx) => (
                      <li key={idx} className="d-flex align-items-center mb-3">
                        <i className="bi bi-check-circle me-3" style={{ fontSize: "2.5rem", color: "#2264c6", background: "transparent" }}></i>
                        <div className="d-flex flex-column">
                          <span className="fs-1">{exercise.name}</span>
                          <span className="text-secondary">{exercise.sets} sets of {exercise.reps} reps {exercise.weight ? `@ ${exercise.weight} lbs` : ''}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div style={{ background: 'var(--card-bg)' }} className="card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
              <h2 className="text-light fs-1 p-3">Weekly Volume</h2>
              {savedWorkout?.exercises ? (
                <div className='row'>
                  <div className="exercise-table col-sm-12 col-md-6 col-lg-6 fs-5">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Exercise</th>
                          <th>Sets</th>
                          <th>Reps</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedWorkout.exercises.map((exercise, idx) => (
                          <tr key={idx}>
                            <td>{exercise.name}</td>
                            <td>{exercise.sets}</td>
                            <td>{exercise.reps}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="weekly-graph col-sm-12 col-md-6 col-lg-6">
                    {/* Placeholder for the weekly graph */}
                  </div>
                </div>
              ) : (
                <p className="text-secondary">No workout data yet.</p>
              )}
            </div>
          </div>
          <div className="row">
            <div style={{ background: 'var(--card-bg)' }} className="col-sm-12 col-md-6 col-lg-6 calorie-tracker rounded-5 p-4 mt-3">
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
            <div style={{ background: 'var(--card-bg)' }} className="col-sm-12 col-md-6 col-lg-6 calorie-tracker rounded-5 p-4 mt-3">
              <h2 className="text-light fs-1 mb-3">Stats</h2>
              <div className="row justify-content-center g-3">

                {/* Column 1 */}
                <div className="col-12 col-md-4 col-lg-4">
                  <div style={{ backgroundColor: "#332E2E" }} className="p-4 rounded-5 text-center h-100">
                    <p className="fs-1 fw-bold mb-1" style={{ color: "var(--color-blue)" }}>175LBS</p>
                    <span className="text-secondary d-block">Weight</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="col-12 col-md-4 col-lg-4">
                  <div style={{ backgroundColor: "#332E2E" }} className="p-4 rounded-5 text-center h-100">
                    <p className="fs-1 fw-bold mb-1" style={{ color: "var(--color-blue)" }}>15 %</p>
                    <span className="text-secondary d-block">Body Fat</span>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="col-12 col-md-4 col-lg-4">
                  <div style={{ backgroundColor: "#332E2E" }} className="p-4 rounded-5 text-center h-100">
                    <p className="fs-1 fw-bold mb-1" style={{ color: "var(--color-blue)" }}>Sep 1</p>
                    <span className="text-secondary d-block">Deadline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        )}
      
      </div>
       {isLoadingWorkout && (
         <CreateWorkout className="w-100" isLoadingWorkout={isLoadingWorkout} onSave={handleSave} />
       )}
    </>
    
  )
}

export default App;