import { useState } from 'react';
import Button from './btn';
import { auth, db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";

const steps = [
    {
        step: 1,
        title: "Select Workout Days",
        description: "Choose the days of the week you want to work out.",
        type: "select",
        options: [
            { id: "monday", name: "Monday", step: 1 },
            { id: "tuesday", name: "Tuesday", step: 2 },
            { id: "wednesday", name: "Wednesday", step: 3 },
            { id: "thursday", name: "Thursday", step: 4 },
            { id: "friday", name: "Friday", step: 5 },
            { id: "saturday", name: "Saturday", step: 6 },
            { id: "sunday", name: "Sunday", step: 7 }
        ]
    },
    {
        step: 2,
        title: "Select muscle groups for each day",
        description: "This will determine the exercises for each day",
        options: [
            { id: "push", name: "Push (Chest, Shoulders, Triceps)" },
            { id: "pull", name: "Pull (Back, Biceps)" },
            { id: "legs", name: "Legs/lower (Quads, Hamstrings, Glutes, Calves)" },
            { id: "fullBody", name: "Full Body (Chest, Back, Shoulders, Arms, Legs)" },
        ]
    },
    {
        step: 3,
        title: "review",
        description: "Everything Good?"

    }
]

export function MakeNewSchedule({ onBack, workoutDays }) {
    const [schedule, setSchedule] = useState([]);
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSelectedDays = (selectedDay) => {
        setSchedule((currentSchedule) => {
            const isAlreadySelected = currentSchedule.some(
                (day) => day.id === selectedDay.id
            );

            if (isAlreadySelected) {
                return currentSchedule.filter(
                    (day) => day.id !== selectedDay.id
                );
            }

            return [...currentSchedule, selectedDay].sort(
                (firstDay, secondDay) => firstDay.step - secondDay.step
            );
        });
    }
    const handleSelectedSplits = (dayId, splitId) => {
        setSchedule((currentSchedule) => {
            return currentSchedule.map((day) => {
                if (day.id === dayId) {
                    return {
                        ...day,
                        splitId
                    };
                }

                return day;
            });
        });
    };
    const handleOnSave = async () => {
        const user = auth.currentUser;

        if (!user) {
            console.error("User is not signed in.");
            return;
        }

        setSaving(true);
        setSaved(false);

        try {
            await setDoc(
                doc(db, "users", user.uid),
                { schedule },
                { merge: true }
            );

            setSaved(true);
        } catch (error) {
            console.error("Failed to save schedule:", error);
        } finally {
            setSaving(false);
        }
    }

    if (saving) {
        return (
            <main className="make-schedule-page">
                <section className="col-sm-12 col-md-8 col-lg-8 make-schedule dashboard-card rounded-5 p-4">
                    <div className="schedule-save-status" role="status" aria-live="polite">
                        <span className="schedule-save-spinner" aria-hidden="true" />
                        <h2>Saving your schedule</h2>
                        <p>Please wait while your workout plan is saved.</p>
                    </div>
                </section>
            </main>
        );
    }

    if (saved) {
        return (
            <main className="make-schedule-page">
                <section className="col-sm-12 col-md-8 col-lg-8 make-schedule dashboard-card rounded-5 p-4">
                    <div className="schedule-save-status" role="status" aria-live="polite">
                        <span className="schedule-save-check" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M5 12.5 9.5 17 19 7.5" />
                            </svg>
                        </span>
                        <h2>Schedule saved</h2>
                        <p>Your weekly workout schedule is ready.</p>
                        <Button
                            text="Back to dashboard"
                            className="schedule-dashboard-button"
                            onClick={onBack}
                        />
                    </div>
                </section>
            </main>
        );
    }
    return (
        <>
            <main className="make-schedule-page">
                <section className=" col-sm-12 col-md-8 col-lg-8 make-schedule dashboard-card rounded-5  p-4">
                    <div className="make-schedule-content">
                        <h1>Create Schedule</h1>
                        <div>
                            {step === 0 && (
                                <>
                                    <h2>{steps[step].title}</h2>
                                    <p>{steps[step].description}</p>
                                    <div className="schedule-option-grid">

                                        {steps[step].options.map((o) => (
                                            <Button
                                                className={`schedule-option-card ${schedule.some((day) => day.id === o.id) ? "selected" : ""}`}
                                                key={o.id}
                                                text={o.name}
                                                bg={schedule.some((day) => day.id === o.id) ? "#2564b7" : "#161616"}
                                                border={schedule.some((day) => day.id === o.id) ? "2px solid #69a7ff" : "2px solid #3e3e3e"}
                                                onClick={() => handleSelectedDays(o)}
                                                ariaLabel={`${schedule.some((day) => day.id === o.id) ? "Deselect" : "Select"} ${o.name}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            {step === 1 && (
                                <>
                                    <h2>{steps[step].title}</h2>
                                    <p>{steps[step].description}</p>
                                    <div className="schedule-focus-list">
                                        {schedule.map((workoutDay) => (
                                            <div className="schedule-focus-card" key={workoutDay.id}>
                                                <label
                                                    className="schedule-focus-label"
                                                    htmlFor={`focus-${workoutDay.id}`}
                                                >
                                                    <span className="schedule-focus-day">{workoutDay.name}</span>
                                                    <span className="schedule-focus-hint">Choose this day&apos;s focus</span>
                                                </label>
                                                <select
                                                    id={`focus-${workoutDay.id}`}
                                                    className="schedule-focus-select"
                                                    value={workoutDay.splitId ?? ""}
                                                    onChange={(event) =>
                                                        handleSelectedSplits(workoutDay.id, event.target.value)
                                                    }
                                                >
                                                    <option value="" disabled>Select muscle focus</option>
                                                    {steps[step].options.map((option) => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <h2>{steps[step].title}</h2>
                                    <p>{steps[step].description}</p>
                                    <div className="schedule-review-list">
                                        {schedule.map((day) => {
                                            const selectedSplit = steps[1].options.find(
                                                (option) => option.id === day.splitId
                                            );

                                            return (
                                                <div key={day.id} className="schedule-review-card">
                                                    <div>
                                                        <span className="schedule-review-label">Workout day</span>
                                                        <h3>{day.name}</h3>
                                                    </div>
                                                    <div className="schedule-review-focus">
                                                        <span className="schedule-review-label">Training focus</span>
                                                        <strong className={selectedSplit ? "schedule-review-badge" : "schedule-review-missing"}>
                                                            {selectedSplit?.name ?? "No focus selected"}
                                                        </strong>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                            <div className="schedule-actions mt-5">
                                <Button
                                    text={"Back"}
                                    className="schedule-action-button"
                                    bg="#2d2d2d"
                                    color="#d8d8d8"
                                    border="1px solid #4a4a4a"
                                    onClick={() => setStep((previousStep) => Math.max(previousStep - 1, 0))}
                                />
                                <Button
                                    text={step === 2 ? "Save" : "Next"}
                                    className="schedule-action-button"
                                    onClick={step === 2 ? handleOnSave : () => setStep((previousStep) => previousStep + 1)}
                                    isDisabled={
                                        step === 0
                                            ? schedule.length === 0
                                            : step === 2 && schedule.some((day) => !day.splitId)
                                    }
                                />
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </>
    )

}
