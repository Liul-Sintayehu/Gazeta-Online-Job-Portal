import React, { useState, useEffect } from 'react';

interface CountUpProps {
  targetNumber: number;
  duration?: number; // Duration in milliseconds
}

const CountUp: React.FC<CountUpProps> = ({ targetNumber, duration = 1000 }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const startTimestamp = performance.now();
    const step = (timestamp: number) => {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1
      const easedProgress = easeOutQuad(progress); // Optional easing function
      setCurrentNumber(Math.floor(easedProgress * targetNumber));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetNumber, duration]);

  // Easing function for a smoother animation
  const easeOutQuad = (t: number) => t * (2 - t);

  return <span>{currentNumber.toLocaleString()}</span>;
};

export default CountUp;
