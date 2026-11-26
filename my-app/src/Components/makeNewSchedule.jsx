import { useState } from 'react';
import Button from './btn';


const steps = [
    {
        step: 1,
        title: "Select Workout Days",
        description: "Choose the days of the week you want to work out.",
        type: "select",
        options: [
            { id: "monday", name: "Monday" },
            { id: "tuesday", name: "Tuesday"},
            { id: "wednesday", name: "Wednesday"},
            { id: "thursday", name: "Thursday"},
            { id: "friday", name: "Friday"},
            { id: "saturday", name: "Saturday"},
            { id: "sunday", name: "Sunday"}
        ]
    },
    {
        step: 2,
        title: "Select muscle groups for each day",
        description: "This will determine the exercises for each day",
        
    },
    {
    }
]

export function MakeNewSchedule({ onCreate, workoutDays }) {
    const [schedule, setSchedule] = useState([]);
    const [step, setStep] = useState(0);

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

            return [...currentSchedule, selectedDay];
        });
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
                                {schedule.map((workoutDay) => (
                                    <div key={workoutDay.id}>{workoutDay.name}</div>
                                ))}
                            </>
                        )}
                        <div className="schedule-actions mt-5">
                            <Button
                                text="Back"
                                className="schedule-action-button"
                                bg="#2d2d2d"
                                color="#d8d8d8"
                                border="1px solid #4a4a4a"
                                onClick={() => setStep((previousStep) => Math.max(previousStep - 1, 0))}
                            />
                            <Button
                                text="Next"
                                className="schedule-action-button"
                                onClick={() => setStep((previousStep) => previousStep + 1)}
                                isDisabled={step === 0 && schedule.length === 0}
                            />
                        </div>

                    </div>
                </div>
            </section>
        </main>
    </>
    )

}
