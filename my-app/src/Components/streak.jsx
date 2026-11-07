import {useState} from 'react';
export function Streak() {
    const [streak, setStreak] =  useState(0);


    return (
        <div className="streak-container">
            <h2>Current Streak: {streak}</h2>
        </div>
    )
}