"use client";

import { useEffect, useRef, useState } from "react";

type Ball = { step: number; slot: number; next: number; progress: number };
const ROWS = 16;
const BATCH = 800;

export default function GaltonBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(1);
  const pausedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Respect the system preference; the play button can explicitly resume it.
    const syncMotion = () => { pausedRef.current = motion.matches; setPaused(motion.matches); };
    syncMotion();
    motion.addEventListener("change", syncMotion);
    let width = 1, height = 1, frame = 0, last = 0, clock = 0, spawned = 0, phaseTime = 0;
    let phase: "fill" | "hold" | "empty" = "fill";
    let balls: Ball[] = [];
    const bins = new Map<number, number>();
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, .05) * speedRef.current * .5 : 0;
      last = now;
      const tick = pausedRef.current || document.hidden ? 0 : dt;
      const gap = Math.min(width / 22, 44);
      const top = 16, bottom = height * .69;
      const rowHeight = (bottom - top) / ROWS;
      if (phase === "fill") {
        clock += tick;
        while (clock >= .035 && spawned < BATCH) {
          clock -= .035; spawned++;
          const halfWidth = Math.max(1, Math.floor(width / (2 * gap)) - 1);
          const slot = Math.floor(Math.random() * (halfWidth * 2 + 1)) - halfWidth;
          balls.push({ step: 0, slot, next: slot + (Math.random() < .5 ? -.5 : .5), progress: 0 });
        }
        balls = balls.filter(ball => {
          ball.progress += tick / .13;
          while (ball.progress >= 1) {
            ball.progress -= 1; ball.slot = ball.next; ball.step++;
            if (ball.step === ROWS) {
              bins.set(ball.slot, (bins.get(ball.slot) || 0) + 1);
              return false;
            }
            // A gentle inward bias keeps widely scattered drops collecting near the middle.
            const rightChance = Math.max(.08, Math.min(.92, .5 - ball.slot * .045));
            ball.next = ball.slot + (Math.random() < rightChance ? .5 : -.5);
          }
          return true;
        });
        if (spawned === BATCH && balls.length === 0) { phase = "hold"; phaseTime = 0; }
      } else {
        phaseTime += tick;
        if (phase === "hold" && phaseTime >= 2) { phase = "empty"; phaseTime = 0; }
        else if (phase === "empty" && phaseTime >= 1.5) {
          bins.clear(); spawned = 0; clock = 0; phase = "fill"; phaseTime = 0;
        }
      }
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#73539330";
      for (let row = 0; row < ROWS; row++) {
        for (let col = -11; col <= 11; col++) {
          const x = width / 2 + (col + (row % 2 ? .5 : 0)) * gap;
          ctx.beginPath(); ctx.arc(x, top + row * rowHeight, 2, 0, Math.PI * 2); ctx.fill();
        }
      }
      const floor = height - 10;
      const radius = Math.max(2, Math.min(4, gap / 7));
      const ballGap = radius * 2 + 1;
      const columns = Math.max(2, Math.floor((gap - 5) / ballGap));
      const drain = phase === "empty" ? phaseTime * phaseTime * height : 0;
      ctx.strokeStyle = "#73539326"; ctx.lineWidth = 1;
      for (let bin = -9; bin <= 9; bin++) {
        const x = width / 2 + (bin - .5) * gap;
        ctx.beginPath(); ctx.moveTo(x, bottom + 14); ctx.lineTo(x, floor); ctx.stroke();
      }
      ctx.fillStyle = "#73539375";
      bins.forEach((count, slot) => {
        for (let i = 0; i < count; i++) {
          const x = width / 2 + slot * gap + ((i % columns) - (columns - 1) / 2) * ballGap;
          const y = floor - Math.floor(i / columns) * ballGap + drain;
          ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.fillStyle = "#73539399";
      for (const ball of balls) {
        const x = width / 2 + (ball.slot + (ball.next - ball.slot) * ball.progress) * gap;
        const y = top + (ball.step + ball.progress * ball.progress) * rowHeight;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); motion.removeEventListener("change", syncMotion); };
  }, []);

  return <>
    <canvas ref={canvasRef} className="galton-canvas" aria-hidden="true" />
    <div className={`galton-controls ${expanded ? "is-expanded" : "is-collapsed"}`}>
      <button className="galton-toggle" type="button" aria-label={expanded ? "Close animation controls" : "Open animation controls"} aria-expanded={expanded} aria-controls="galton-settings" onClick={() => setExpanded(value => !value)}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 2h6M12 2v3m6 1 2 2" /><circle cx="12" cy="14" r="8" /><path d="M12 9v5l3 2" /></svg>
      </button>
      <div id="galton-settings" className="galton-settings" hidden={!expanded}>
      <button type="button" aria-label={paused ? "Play falling balls" : "Pause falling balls"} onClick={() => { pausedRef.current = !paused; setPaused(!paused); }}>{paused ? "play" : "pause"}</button>
      <label htmlFor="galton-speed">ball speed</label>
      <input id="galton-speed" type="range" min="0.25" max="3" step="0.25" value={speed} aria-valuetext={`${speed} times normal speed`} onChange={event => { const value = Number(event.target.value); speedRef.current = value; setSpeed(value); }} />
      <output htmlFor="galton-speed">{speed}×</output>
      </div>
    </div>
  </>;
}
