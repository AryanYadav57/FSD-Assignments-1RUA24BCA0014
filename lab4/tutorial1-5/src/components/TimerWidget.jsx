import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

const TimerWidget = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const totalTimeRef = useRef(0);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      playTune();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const playTune = () => {
    // Play a simple beep using Web Audio API
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1); // Play for 1 second
  };

  const toggleTimer = () => {
    if (!isActive) {
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
      if (totalSeconds > 0) {
        totalTimeRef.current = totalSeconds;
        setTimeLeft(totalSeconds);
        setIsActive(true);
      }
    } else {
      setIsActive(false);
    }
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = totalTimeRef.current > 0 
    ? circumference - (timeLeft / totalTimeRef.current) * circumference 
    : 0;

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div style={{ flex: 1, backgroundColor: '#1E1E1E', borderRadius: '24px', padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', color: 'white' }}>
      
      {/* Circular Progress */}
      <div style={{ position: 'relative', width: '150px', height: '150px' }}>
        <svg width="150" height="150">
          <circle
            cx="75" cy="75" r={radius}
            stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"
          />
          <circle
            cx="75" cy="75" r={radius}
            stroke="#FF4ADE" strokeWidth="8" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontFamily: 'monospace'
        }}>
          {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>
      </div>

      {/* Controls */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Hours</span>
            <input type="number" min="0" value={hours} onChange={e => setHours(Number(e.target.value))} disabled={isActive}
              style={{ width: '40px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', textAlign: 'center' }} />
          </div>
          <span>:</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Minutes</span>
            <input type="number" min="0" max="59" value={minutes} onChange={e => setMinutes(Number(e.target.value))} disabled={isActive}
              style={{ width: '40px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', textAlign: 'center' }} />
          </div>
          <span>:</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Seconds</span>
            <input type="number" min="0" max="59" value={seconds} onChange={e => setSeconds(Number(e.target.value))} disabled={isActive}
              style={{ width: '40px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', textAlign: 'center' }} />
          </div>
        </div>
        <Button 
          onClick={toggleTimer}
          style={{ backgroundColor: '#FF4ADE', color: 'white', borderRadius: '24px', width: '100%', padding: '0.5rem' }}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
      </div>
      
    </div>
  );
};

export default TimerWidget;
