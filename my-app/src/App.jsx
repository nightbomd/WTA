import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import ProgressBar from './Components/progressBar'
import './App.css'
import DonutComponent from './Components/donut'

function App() {

  return (
    <>
      <body style={{ background: 'var(--bg-color)' }} className="p-5">
        <header>
          <h1 className="mb-5" style={{ fontSize: 'var(--font-size-header)' }}><span className="text-light mb-4">Welcome,</span> <br /><span style={{ color: 'var(--color-blue)' }}>Marcus!</span></h1>
        </header>
        <main>
          <div className="row g-5">
            <div style={{ background: 'var(--card-bg)' }} className=" card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
              <p className="text-secondary">Today's workout:</p>
              <h2 className="text-light">Monday: <span className="p-2 rounded-5" style={{ background: "var(--span-red)", color: "var(--color-red)" }}>PUSH</span></h2>
              <ProgressBar text="5/6 exercises" value={30} bg="var(--color-blue)" />
              <div className="exercise-list text-light">
                <ul className="list-unstyled"> {/* list-unstyled removes default bullet points */}

                  <li className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle me-3" style={{ fontSize: "2.5rem", color: "#2264c6", background: "transparent" }}></i>
                    <div className="d-flex flex-column">
                      <span className="fs-1">Bench Press</span>
                      <span className="text-secondary">3 sets of 10 reps</span>
                    </div>
                  </li>

                  <li className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle me-3" style={{ fontSize: "2.5rem", color: "#2264c6", background: "transparent" }}></i>
                    <div className="d-flex flex-column">
                      <span className="fs-1">Push Ups</span>
                      <span className="text-secondary">3 sets of 15 reps</span>
                    </div>
                  </li>

                  <li className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle me-3" style={{ fontSize: "2.5rem", color: "#2264c6", background: "transparent" }}></i>
                    <div className="d-flex flex-column">
                      <span className="fs-1">Tricep Dips</span>
                      <span className="text-secondary">3 sets of 12 reps</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{ background: 'var(--card-bg)' }} className="card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
              <h2 className="text-light">Weekly Volume</h2>
              <div className='row'>
                <div className="exercise-table col-sm-12 col-md-6 col-lg-6">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Muscle Group</th>
                        <th>Sets/week</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Bench Press</td>
                        <td>Chest</td>
                        <td>10</td>
                      </tr>
                      <tr>
                        <td>Push Ups</td>
                        <td>Chest</td>
                        <td>15</td>
                      </tr>
                      <tr>
                        <td>Tricep Dips</td>
                        <td>Triceps</td>
                        <td>12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="weekly-graph col-sm-12 col-md-6 col-lg-6">
                  {/* Placeholder for the weekly graph */}
                </div>
              </div>
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
          </div>
        </main>
      </body>
    </>
  )
}

export default App; 
