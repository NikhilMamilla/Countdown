import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { KalachakraBackground } from './components/background/KalachakraBackground';
import { CountdownDisplay } from './components/CountdownDisplay';
import { LaunchButton } from './components/LaunchButton';
import { LaunchReveal } from './components/LaunchReveal';
import { useCountdown } from './lib/useCountdown';
import { loadLaunch, saveLaunch, clearLaunch, type LaunchRecord } from './lib/launchState';
import { playActivationSound, playImpactSound } from './lib/ignitionSound';
import type { CountdownSnapshot } from './lib/countdown';
import { DURATION_HOURS, EVENT_NAME, EVENT_SUBTITLE, EVENT_TAG, STATUS_READY, STATUS_LIVE, TAGLINE_TRANSIENT } from './config';

const STATIC_SNAPSHOT: CountdownSnapshot = {
  remainingMs: DURATION_HOURS * 3600_000,
  elapsedMs: 0,
  totalMs: DURATION_HOURS * 3600_000,
  progress: 0,
  isComplete: false,
};

const TAGLINE_HOLD_MS = 2400;
const LOCK_IN_HOLD_MS = 700;

type Phase = 'idle' | 'reveal' | 'running';

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [launch, setLaunch] = useState<LaunchRecord | null>(() => loadLaunch());
  const [phase, setPhase] = useState<Phase>(() => (loadLaunch() ? 'running' : 'idle'));
  const [activated, setActivated] = useState<boolean>(() => loadLaunch() !== null);
  const [justActivated, setJustActivated] = useState(false);
  const [intensifyBackground, setIntensifyBackground] = useState(false);
  const [showTransientTagline, setShowTransientTagline] = useState(false);

  const liveCountdown = useCountdown(launch?.startTime ?? 0, launch?.endTime ?? 0);
  const displaySnapshot = activated ? liveCountdown : STATIC_SNAPSHOT;
  const isComplete = activated && liveCountdown.isComplete;

  const handleLaunch = useCallback(() => {
    if (phase !== 'idle') return; // guard against a double-start
    const startTime = Date.now();
    const endTime = startTime + DURATION_HOURS * 60 * 60 * 1000;
    const record: LaunchRecord = { startTime, endTime };
    saveLaunch(record);
    setLaunch(record);
    setPhase(prefersReducedMotion ? 'running' : 'reveal');
    if (prefersReducedMotion) {
      setActivated(true);
    }
    // AudioContext construction can itself take a couple hundred ms on some
    // systems — deferred so it can never delay the visual reveal starting.
    setTimeout(playActivationSound, 0);
  }, [phase, prefersReducedMotion]);

  const handleActivate = useCallback(() => {
    setIntensifyBackground(true);
  }, []);

  const handleImpact = useCallback(() => {
    setActivated(true);
    setJustActivated(true);
    setShowTransientTagline(true);
    setTimeout(() => setJustActivated(false), LOCK_IN_HOLD_MS);
    setTimeout(() => setShowTransientTagline(false), TAGLINE_HOLD_MS);
    setTimeout(playImpactSound, 0);
  }, []);

  const handleRevealDone = useCallback(() => {
    setPhase('running');
  }, []);

  const handleReset = useCallback(() => {
    if (!window.confirm('Reset the countdown? This clears the current launch.')) return;
    clearLaunch();
    setLaunch(null);
    setPhase('idle');
    setActivated(false);
    setJustActivated(false);
    setShowTransientTagline(false);
  }, []);

  // Keep multiple tabs/windows on the same machine in sync with each other.
  useEffect(() => {
    const onStorage = () => {
      const record = loadLaunch();
      setLaunch(record);
      setPhase(record ? 'running' : 'idle');
      setActivated(record !== null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white flex items-center justify-center">
      <KalachakraBackground intensify={intensifyBackground} />

      <main className="relative z-10 flex flex-col items-center gap-[clamp(0.85rem,2.6vh,2rem)] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-1.5"
        >
          <h1 className="font-display font-black uppercase tracking-[0.08em] text-[clamp(1.5rem,4.2vw,3.25rem)] text-white drop-shadow-[0_0_24px_rgba(255,43,77,0.3)]">
            {EVENT_NAME}
          </h1>
          <p className="font-body tracking-[0.55em] text-crimson-400 uppercase text-[clamp(0.7rem,1.4vw,1.1rem)]">
            {EVENT_SUBTITLE}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activated ? 'status-live' : 'status-ready'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="font-body text-[10px] sm:text-xs tracking-[0.4em] uppercase text-ink-400"
          >
            {activated ? STATUS_LIVE : STATUS_READY}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isComplete && (
            <motion.div
              key={activated ? 'countdown-live' : 'countdown-static'}
              initial={activated ? { opacity: 0, scale: 0.92, filter: 'blur(8px)' } : false}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={justActivated ? 'drop-shadow-[0_0_36px_rgba(255,43,77,0.35)]' : undefined}
            >
              <CountdownDisplay countdown={displaySnapshot} />
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3"
            >
              <span className="font-mono font-tabular text-[clamp(3.5rem,14vw,11.5rem)] leading-none text-ink-300">
                00:00:00
              </span>
              <h2 className="font-display font-black uppercase tracking-[0.12em] text-[clamp(1.75rem,5vw,4rem)] text-white motion-safe:animate-pulse-glow">
                Time&apos;s Up
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              key="launch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <LaunchButton onLaunch={handleLaunch} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={showTransientTagline ? 'tagline-transient' : 'tagline-default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="font-body tracking-[0.5em] text-ink-400 uppercase text-[clamp(0.65rem,1.3vw,1rem)]"
          >
            {showTransientTagline ? TAGLINE_TRANSIENT : EVENT_TAG}
          </motion.p>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {phase === 'reveal' && <LaunchReveal key="reveal" onActivate={handleActivate} onImpact={handleImpact} onDone={handleRevealDone} />}
      </AnimatePresence>

      {phase !== 'idle' && (
        <button
          type="button"
          onClick={handleReset}
          className="fixed bottom-3 right-4 z-20 font-body text-[10px] tracking-widest uppercase text-white/20 hover:text-white/60 transition-colors"
        >
          reset
        </button>
      )}
    </div>
  );
}
