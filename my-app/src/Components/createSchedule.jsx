import Button from "./btn";
import { useState } from "react";

export function ScheduleCard({ onMakeSchedule }) {
    const [schedule, setSchedule] = useState([]);
    

    return (
        <section className="schedule-card dashboard-card rounded-5 p-4">
            <h2 className="text-light section-heading">Schedule</h2>

            {schedule.length === 0 ? (
                <div className="schedule-empty-state dashboard-empty-state">
                    <p className="text-secondary mb-3">
                        No schedule created yet. Build one to organize your workout week.
                    </p>
                    <Button text="Make Schedule" onClick={onMakeSchedule} />
                </div>
            ) : (
                <ul className="schedule-list">
                    {schedule.map((item, index) => (
                        <li className="schedule-list__item" key={index}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
