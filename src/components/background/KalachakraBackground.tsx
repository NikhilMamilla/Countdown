import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Crack {
  left: number;
  top: number;
  height: number;
  rotate: number;
  delay: number;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    duration: 18 + Math.random() * 24,
    delay: Math.random() * -30,
    opacity: 0.2 + Math.random() * 0.4,
  }));
}

function makeCracks(count: number): Crack[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 60,
    height: 80 + Math.random() * 160,
    rotate: -8 + Math.random() * 16,
    delay: Math.random() * 5,
  }));
}

interface KalachakraBackgroundProps {
  /** Briefly boosts the ambient red glow — for the moment the countdown activates. Self-resets. */
  intensify?: boolean;
}

/**
 * Original, code-generated atmosphere — no external image assets, so it
 * can never fail to load. Combines a Japanese-energy-pattern gradient field
 * (Demon Slayer-inspired) with a red-glow particle/crack field
 * (Stranger Things-inspired) into one unique identity.
 */
export function KalachakraBackground({ intensify = false }: KalachakraBackgroundProps) {
  const particles = useMemo(() => makeParticles(46), []);
  const cracks = useMemo(() => makeCracks(5), []);

  return (
    <div aria-hidden="true">
      <div className="kalachakra-bg" />
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {cracks.map((c, i) => (
          <div
            key={i}
            className="dimensional-crack"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              height: `${c.height}px`,
              width: '1px',
              transform: `rotate(${c.rotate}deg)`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-crimson-400 motion-safe:animate-drift"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: '0 0 6px rgba(255,92,115,0.6)',
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {intensify && (
          <motion.div
            key="intensify-pulse"
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 68% 55% at 50% 50%, rgba(255,43,77,0.32), transparent 72%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, times: [0, 0.22, 1], ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <div className="grain-overlay" />
    </div>
  );
}
