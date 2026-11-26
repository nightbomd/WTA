import Button from "./btn";
import { useState } from "react";

export function ScheduleCard() {
    const [schedule, setSchedule] = useState([]);

    return (
        <div className="schedule-card">
            <h3>Schedule</h3>
            <ul>
                {schedule.length === 0 ? (
                    <li>No schedule available. Create one <Button text="make schedule"></Button></li>
                ) : (
                    schedule.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                )}
            </ul>
        </div>
    )
}