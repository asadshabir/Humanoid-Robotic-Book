import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface SimulationProps {
  type: 'pid' | 'robotic-arm' | 'sensor-fusion' | 'trajectory';
  title?: string;
}

const InteractiveSimulation: React.FC<SimulationProps> = ({ type, title }) => {
  // Haptic feedback utility
  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      const pattern = intensity === 'heavy' ? [30] : intensity === 'medium' ? [15] : [10];
      window.navigator.vibrate(pattern);
    }
  };

  // PID States
  const [kp, setKp] = useState(2.0);

  // Robotic Arm States (Joint angles in radians)
  const [theta1, setTheta1] = useState(0.5);
  const [theta2, setTheta2] = useState(0.8);

  // Sensor Fusion States
  const [noise, setNoise] = useState(15);
  const [alpha, setAlpha] = useState(0.1); // Complementary filter alpha

  // Trajectory States
  const [waypoints, setWaypoints] = useState([{x: 50, y: 150}, {x: 300, y: 50}, {x: 550, y: 150}]);
  const [resolution, setResolution] = useState(20);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Robotic Arm Constants
    const L1 = 60;
    const L2 = 60;
    const originX = canvas.width / 2;
    const originY = canvas.height - 40;

    // PID Variables
    let position = 0;
    let velocity = 0;
    const target = 100;
    const dt = 0.1;
    const pidData: number[] = [];

    // Sensor Fusion Variables
    let trueValue = 100;
    let rawData: number[] = [];
    let filteredData: number[] = [];
    let lastFiltered = 100;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (type === 'pid') {
        const error = target - position;
        const force = error * kp;
        velocity += force * dt;
        position += velocity * dt;
        velocity *= 0.95;

        pidData.push(position);
        if (pidData.length > canvas.width) pidData.shift();

        ctx.strokeStyle = '#262626';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - target);
        ctx.lineTo(canvas.width, canvas.height - target);
        ctx.stroke();

        ctx.strokeStyle = '#2d7de0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        pidData.forEach((val, i) => ctx.lineTo(i, canvas.height - val));
        ctx.stroke();
      }

      else if (type === 'robotic-arm') {
        // FK: Compute joint positions
        const x1 = originX + L1 * Math.sin(theta1);
        const y1 = originY - L1 * Math.cos(theta1);
        const x2 = x1 + L2 * Math.sin(theta1 + theta2);
        const y2 = y1 - L2 * Math.cos(theta1 + theta2);

        // Draw Base
        ctx.fillStyle = '#404040';
        ctx.fillRect(originX - 20, originY, 40, 10);

        // Draw Links
        ctx.strokeStyle = '#2d7de0';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw Joints
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(originX, originY, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x1, y1, 5, 0, Math.PI * 2); ctx.fill();

        // Draw End Effector
        ctx.fillStyle = '#22c55e';
        ctx.beginPath(); ctx.arc(x2, y2, 6, 0, Math.PI * 2); ctx.fill();
      }

      else if (type === 'sensor-fusion') {
        // Generate noisy signal
        const currentNoise = (Math.random() - 0.5) * noise;
        const raw = trueValue + currentNoise;

        // Complementary/Low-pass filter: y = alpha * raw + (1 - alpha) * last
        const filtered = alpha * raw + (1 - alpha) * lastFiltered;
        lastFiltered = filtered;

        rawData.push(raw);
        filteredData.push(filtered);

        if (rawData.length > canvas.width) {
          rawData.shift();
          filteredData.shift();
        }

        // Draw Target Line
        ctx.strokeStyle = '#ffffff33';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - trueValue);
        ctx.lineTo(canvas.width, canvas.height - trueValue);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Raw Noisy Signal
        ctx.strokeStyle = '#ef4444'; // Red
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        rawData.forEach((val, i) => ctx.lineTo(i, canvas.height - val));
        ctx.stroke();

        // Draw Filtered Signal
        ctx.strokeStyle = '#22c55e'; // Green
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        filteredData.forEach((val, i) => ctx.lineTo(i, canvas.height - val));
        ctx.stroke();
      }

      else if (type === 'trajectory') {
        // Linear Interpolation Path
        ctx.strokeStyle = '#2d7de0';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        waypoints.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.setLineDash([]);

        // Spline / Smooth Trajectory (Quadratic Bezier as proxy)
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);

        for (let i = 0; i <= resolution; i++) {
          const t = i / resolution;
          // Quadratic Bezier Formula: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
          const x = Math.pow(1 - t, 2) * waypoints[0].x + 2 * (1 - t) * t * waypoints[1].x + Math.pow(t, 2) * waypoints[2].x;
          const y = Math.pow(1 - t, 2) * waypoints[0].y + 2 * (1 - t) * t * waypoints[1].y + Math.pow(t, 2) * waypoints[2].y;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Waypoints
        ctx.fillStyle = '#ffffff';
        waypoints.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [type, kp, theta1, theta2, noise, alpha, waypoints, resolution]);

  return (
    <div className={styles.simulationContainer}>
      {title && <h4 className={styles.simulationTitle}>{title}</h4>}

      <div className={styles.simulationVisual}>
        <canvas ref={canvasRef} width={600} height={200} className={styles.canvas} />
      </div>

      <div className={styles.controls}>
        {type === 'pid' && (
          <div className={styles.controlGroup}>
            <label>Proportional Gain (Kp): {kp.toFixed(1)}</label>
            <input type="range" min="0.1" max="10" step="0.1" value={kp}
              onChange={(e) => {
                setKp(parseFloat(e.target.value));
                triggerHaptic('light');
              }} />
          </div>
        )}
        {type === 'robotic-arm' && (
          <div className={styles.controlRow}>
            <div className={styles.controlGroup}>
              <label>Joint 1 (θ₁): {(theta1 * 180 / Math.PI).toFixed(0)}°</label>
              <input type="range" min="-1.5" max="1.5" step="0.05" value={theta1}
                onChange={(e) => {
                  setTheta1(parseFloat(e.target.value));
                  triggerHaptic('light');
                }} />
            </div>
            <div className={styles.controlGroup}>
              <label>Joint 2 (θ₂): {(theta2 * 180 / Math.PI).toFixed(0)}°</label>
              <input type="range" min="-2.5" max="2.5" step="0.05" value={theta2}
                onChange={(e) => {
                  setTheta2(parseFloat(e.target.value));
                  triggerHaptic('light');
                }} />
            </div>
          </div>
        )}
        {type === 'sensor-fusion' && (
          <div className={styles.controlRow}>
            <div className={styles.controlGroup}>
              <label>Sensor Noise Level: {noise}</label>
              <input type="range" min="0" max="100" step="1" value={noise}
                onChange={(e) => {
                  setNoise(parseInt(e.target.value));
                  triggerHaptic('light');
                }} />
            </div>
            <div className={styles.controlGroup}>
              <label>Filter Strength (α): {alpha.toFixed(2)}</label>
              <input type="range" min="0.01" max="0.5" step="0.01" value={alpha}
                onChange={(e) => {
                  setAlpha(parseFloat(e.target.value));
                  triggerHaptic('light');
                }} />
            </div>
          </div>
        )}
        {type === 'trajectory' && (
          <div className={styles.controlRow}>
            <div className={styles.controlGroup}>
              <label>Control Point Alpha (X): {waypoints[1].x}</label>
              <input type="range" min="100" max="500" step="1" value={waypoints[1].x}
                onChange={(e) => {
                  setWaypoints([waypoints[0], {x: parseInt(e.target.value), y: waypoints[1].y}, waypoints[2]]);
                  triggerHaptic('medium');
                }} />
            </div>
            <div className={styles.controlGroup}>
              <label>Path Smoothing (Resolution): {resolution}</label>
              <input type="range" min="5" max="200" step="5" value={resolution}
                onChange={(e) => {
                  setResolution(parseInt(e.target.value));
                  triggerHaptic('light');
                }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveSimulation;
