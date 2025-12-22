import React, { useState, useEffect } from "react";

const CountdownTimer = ({ startTime }) => {
    const [timeLeft, setTimeLeft] = useState(8 * 60 * 1000);

    useEffect(() => {
        const start = new Date(startTime).getTime();
        const end = start + 8 * 60 * 1000;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const remainingTime = Math.max(end - now, 0);
            setTimeLeft(remainingTime);
        };

        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div>
            {timeLeft > 0 ? (
                <h1>
                    {minutes}:{seconds}m
                </h1>
            ) : (
                null
            )}
        </div>
    );
};

export default CountdownTimer;
