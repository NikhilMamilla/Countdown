import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DURATION_HOURS } from '../config';

interface LaunchButtonProps {
  onLaunch: () => void;
  disabled?: boolean;
}

/**
 * The single most important control on the page. Idle state is calm — a
 * slow breathing glow, nothing spinning or bouncing. Press feedback is a
 * quick physical compression plus one thin energy ring expanding outward,
 * not a burst of effects — the real spectacle happens in LaunchReveal.
 * Frosted-glass styling ties it visually to that reveal and to the
 * countdown's own glass cards.
 */
export function LaunchButton({ onLaunch, disabled }: LaunchButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (disabled || pressed) return;
    setPressed(true);
    onLaunch();
  };

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {pressed && (
          <motion.span
            key="press-ring"
            className="absolute rounded-full border border-crimson-400 pointer-events-none"
            style={{ width: 64, height: 64 }}
            initial={{ scale: 1, opacity: 0.85 }}
            animate={{ scale: 5.5, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || pressed}
        whileTap={{ scale: 0.96, filter: 'brightness(1.25)' }}
        animate={
          pressed
            ? { scale: 0.96 }
            : { boxShadow: ['0 0 20px rgba(255,43,77,0.22)', '0 0 38px rgba(255,43,77,0.4)', '0 0 20px rgba(255,43,77,0.22)'] }
        }
        transition={pressed ? { duration: 0.15 } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl px-9 py-4 sm:px-14 sm:py-5 font-display font-black uppercase tracking-[0.14em] text-white text-[clamp(0.95rem,2.1vw,1.4rem)] transition-opacity disabled:cursor-not-allowed disabled:opacity-80"
        aria-label={`Start the ${DURATION_HOURS}-hour countdown`}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: 'linear-gradient(155deg, rgba(255,255,255,0.14), transparent 45%)' }}
          aria-hidden="true"
        />
        <span className="relative">Start Hackathon</span>
      </motion.button>
    </div>
  );
}
