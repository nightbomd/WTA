import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import ProgressBar from './Components/progressBar'
import './App.css'

function App() {
  
  return (
    <>
      <body style={{ background: 'var(--bg-color)' }} className="p-5">
        <header>
          <h1 className="mb-5" style={{ fontSize: 'var(--font-size-header)' }}><span className="text-light mb-4">Welcome,</span> <br /><span style={{ color: 'var(--color-blue)' }}>Marcus!</span></h1>
        </header>
        <main>

          <div style={{ background: 'var(--card-bg)' }} className="card-workout col-sm-12 col-md-6 col-lg-6 rounded-5 shadow p-4">
            <p className="text-secondary">Today's workout:</p>
            <h2 className="text-light">Monday: <span className="p-2 rounded-5" style={{ background: "var(--span-red)", color: "var(--color-red)" }}>PUSH</span></h2>
            <ProgressBar value={30} />
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
        </main>
      </body>
    </>
  )
}

export default App; 
