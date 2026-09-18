import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Ember {
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
}

function makeEmbers(count: number): Ember[] {
  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: 120 + Math.random() * 260,
    size: 2 + Math.random() * 3,
    delay: 0.05 + Math.random() * 0.35,
    duration: 0.9 + Math.random() * 0.6,
  }));
}

const ACTIVATE_MS = 90;
const GLASS_DELAY_MS = 60;
const GLASS_DURATION_MS = 1050;

interface LaunchRevealProps {
  /** Fires almost immediately — a quick "system activated" tick. */
  onActivate?: () => void;
  /** Fires as the glass wipe is mid-expansion — this is when the real countdown should reveal. */
  onImpact?: () => void;
  /** Fires once the whole reveal has finished. */
  onDone: () => void;
  durationMs?: number;
}

/**
 * A single glassmorphic wipe: a frosted, faintly red-tinted glass disc
 * expands from the button's position, briefly distorting everything
 * beneath it, then dissolves to reveal the live countdown — clean and
 * quick rather than busy. A handful of soft embers drift outward for
 * texture; nothing here is a large particle field. Purely decorative — it
 * never touches the countdown's own timestamps.
 */
export function LaunchReveal({ onActivate, onImpact, onDone, durationMs = 1500 }: LaunchRevealProps) {
  const embers = useMemo(() => makeEmbers(10), []);

  useEffect(() => {
    const timers = [
      setTimeout(() => onActivate?.(), ACTIVATE_MS),
      setTimeout(() => onImpact?.(), GLASS_DELAY_MS + GLASS_DURATION_MS * 0.6),
      setTimeout(onDone, durationMs),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onActivate, onImpact, onDone, durationMs]);

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      aria-hidden="true"
    >
      {/* Quick activation tick, right on press. */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-crimson-300/70"
        style={{ width: 18, height: 18 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 13], opacity: [0, 0.8, 0] }}
        transition={{
          scale: { duration: 0.4, delay: ACTIVATE_MS / 1000, times: [0, 1], ease: 'easeOut' },
          opacity: { duration: 0.4, delay: ACTIVATE_MS / 1000, times: [0, 0.3, 1], ease: 'easeOut' },
        }}
      />

      {/* The glass wipe itself. */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 120,
          height: 120,
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.16), rgba(255,43,77,0.12) 55%, rgba(10,7,16,0.04) 80%)',
          backdropFilter: 'blur(26px)',
          WebkitBackdropFilter: 'blur(26px)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: 'inset 0 0 60px rgba(255,255,255,0.07), 0 0 100px rgba(255,43,77,0.3)',
        }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 32], opacity: [0, 1, 1, 0] }}
        transition={{
          scale: { duration: GLASS_DURATION_MS / 1000, delay: GLASS_DELAY_MS / 1000, times: [0, 1], ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: GLASS_DURATION_MS / 1000, delay: GLASS_DELAY_MS / 1000, times: [0, 0.1, 0.6, 1], ease: 'easeInOut' },
        }}
      />

      {/* A handful of soft embers drifting outward. */}
      {embers.map((e, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full bg-white"
          style={{ width: e.size, height: e.size, filter: 'blur(0.5px)' }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: [0, Math.cos(e.angle) * e.distance], y: [0, Math.sin(e.angle) * e.distance], opacity: [0, 0.7, 0] }}
          transition={{
            x: { duration: e.duration, delay: e.delay, times: [0, 1], ease: 'easeOut' },
            y: { duration: e.duration, delay: e.delay, times: [0, 1], ease: 'easeOut' },
            opacity: { duration: e.duration, delay: e.delay, times: [0, 0.3, 1], ease: 'easeOut' },
          }}
        />
      ))}
    </motion.div>
  );
}
