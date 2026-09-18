import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pad2 } from '../lib/utils/time';
import type { CountdownSnapshot } from '../lib/countdown';

const WARNING_MS = 30 * 60 * 1000;
const CRITICAL_MS = 10 * 60 * 1000;
const FINAL_MINUTE_MS = 60 * 1000;

interface CountdownDisplayProps {
  countdown: CountdownSnapshot;
}

export function CountdownDisplay({ countdown }: CountdownDisplayProps) {
  const totalSeconds = Math.floor(countdown.remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isFinalMinute = countdown.remainingMs <= FINAL_MINUTE_MS && !countdown.isComplete;
  const isCritical = countdown.remainingMs <= CRITICAL_MS;
  const isWarning = countdown.remainingMs <= WARNING_MS;

  const tone = isCritical ? 'critical' : isWarning ? 'warning' : 'normal';
  const progressPct = Math.min(100, Math.max(0, countdown.progress * 100));

  return (
    <motion.div
      animate={isFinalMinute ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={isFinalMinute ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : undefined}
      className="flex flex-col items-center gap-[clamp(0.75rem,2vh,1.5rem)] motion-reduce:animate-none"
    >
      <div
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${hours} hours ${minutes} minutes ${seconds} seconds remaining`}
        className="flex items-start"
      >
        <FlipUnit value={hours} label="Hours" tone={tone} />
        <DotSeparator tone={tone} />
        <FlipUnit value={minutes} label="Minutes" tone={tone} />
        <DotSeparator tone={tone} />
        <FlipUnit value={seconds} label="Seconds" tone={tone} />
      </div>

      <div className="h-1 w-[clamp(14rem,42vw,30rem)] overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-crimson-600 via-crimson-400 to-ember-400"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

type Tone = 'normal' | 'warning' | 'critical';

const TONE_STYLES: Record<Tone, { border: string; glow: string; text: string }> = {
  normal: {
    border: 'border-crimson-500/25',
    glow: 'shadow-[0_0_30px_rgba(255,43,77,0.14)]',
    text: 'text-white',
  },
  warning: {
    border: 'border-ember-400/40',
    glow: 'shadow-[0_0_34px_rgba(245,185,66,0.22)]',
    text: 'text-ember-300',
  },
  critical: {
    border: 'border-crimson-400/60',
    glow: 'shadow-[0_0_40px_rgba(255,43,77,0.4)]',
    text: 'text-crimson-300',
  },
};

function FlipUnit({ value, label, tone }: { value: number; label: string; tone: Tone }) {
  const [d1, d2] = pad2(value).split('');
  const style = TONE_STYLES[tone];

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div
        className={`relative flex gap-0.5 rounded-xl sm:rounded-2xl border ${style.border} bg-black/40 backdrop-blur-md px-2.5 py-1.5 sm:px-5 sm:py-3 transition-shadow ${style.glow}`}
        style={{ perspective: 400 }}
      >
        <FlipDigit value={d1} className={style.text} />
        <FlipDigit value={d2} className={style.text} />
      </div>
      <span className="font-body text-[9px] sm:text-xs tracking-[0.4em] text-ink-400 uppercase">{label}</span>
    </div>
  );
}

/**
 * A per-digit flip card: a dimmed "resting" layer always shows the digit
 * this position last settled on, and an animated front layer flips the new
 * digit in over it. The dim layer is what keeps a real digit on screen
 * during the brief instant the front card is edge-on (rotated ~90deg) mid
 * flip, instead of a gap — the actual trick behind the split-flap illusion.
 */
function FlipDigit({ value, className }: { value: string; className: string }) {
  const prevRef = useRef(value);
  const restingValue = prevRef.current;

  useEffect(() => {
    prevRef.current = value;
  }, [value]);

  return (
    <span
      className="relative inline-block h-[1em] overflow-hidden align-top font-mono font-tabular text-[clamp(2.4rem,9vw,7rem)] leading-none"
      style={{ width: '0.62em' }}
    >
      <span className="invisible">{value}</span>

      <span className="absolute inset-0 flex items-center justify-center text-ink-600/70" aria-hidden="true">
        {restingValue}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          className={`absolute inset-0 flex items-center justify-center ${className}`}
          style={{ transformOrigin: '50% 50%', backfaceVisibility: 'hidden' }}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.32, ease: 'easeInOut' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>

      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/50 z-10" aria-hidden="true" />
    </span>
  );
}

function DotSeparator({ tone }: { tone: Tone }) {
  const dotClass = tone === 'critical' ? 'bg-crimson-400' : tone === 'warning' ? 'bg-ember-400' : 'bg-crimson-500/70';
  return (
    <div className="flex h-[clamp(3.2rem,11.5vw,8.5rem)] flex-col items-center justify-center gap-2 sm:gap-3 px-1 sm:px-2" aria-hidden="true">
      <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${dotClass} motion-safe:animate-pulse shadow-[0_0_8px_rgba(255,43,77,0.8)]`} />
      <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${dotClass} motion-safe:animate-pulse shadow-[0_0_8px_rgba(255,43,77,0.8)]`} />
    </div>
  );
}
