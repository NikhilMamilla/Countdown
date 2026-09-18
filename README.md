# TECHSURGE 2K26 — KALACHAKRA

A single-page, fullscreen 24-hour hackathon countdown, built with React,
TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Put it on the projector, press **START** at
the moment the event actually begins.

## How it works

1. **Launch screen.** The page opens on a glowing START button — nothing
   runs until someone presses it.
2. **Ignition.** Pressing it plays a one-shot "official event ignition"
   sequence (dark punch-in, flash, shockwave rings, spark burst, screen
   shake, a synthesized boom) and locks in `startTime = now` /
   `endTime = startTime + DURATION_HOURS`.
3. **Countdown.** A flip-clock display (HOURS / MINUTES / SECONDS cards)
   counts down, with the glow intensifying under 30/10/1 minutes remaining.
4. **Time's Up.** At zero it switches to a "TIME'S UP" state and never
   goes negative.

The launch moment is saved to `localStorage`, so refreshing the page (or
opening it again later) resumes the live countdown directly — the ignition
sequence only plays once, at the actual press.

## Configuring the event

Edit `src/config.ts`:

```ts
export const DURATION_HOURS = 24;
```

That's the only thing to change — there's no fixed clock time to set,
since the countdown starts from whenever Start is pressed.

## How the countdown math works

`src/lib/countdown.ts` computes `remaining = endTime - Date.now()` on every
tick — it never decrements a counter. `src/lib/useCountdown.ts` re-derives
that value on an interval and immediately again whenever the tab regains
visibility. That means:

- Refreshing the page does not reset or skew the countdown.
- A backgrounded/throttled tab catches back up the instant it's visible.
- The displayed time never goes negative — it clamps to `00:00:00` and the
  page switches to the "TIME'S UP" state.

Covered by `src/lib/countdown.test.ts` and `src/lib/launchState.test.ts`
(`npm test`): 24h/1h/1m/1s remaining, exact zero, past the end time, a
simulated refresh mid-event, and the launch-record persistence round-trip.

## Resetting

A small, low-opacity "reset" link sits in the bottom-right corner once the
countdown has been started (for rehearsals / re-tests before the real
event) — it asks for confirmation, then clears the stored launch and
returns to the Start screen.

## Structure

```
src/
  config.ts                        DURATION_HOURS — edit this
  lib/countdown.ts                 pure timestamp math (remaining/elapsed/progress)
  lib/useCountdown.ts              React hook wrapping it
  lib/launchState.ts               persists the Start moment to localStorage
  lib/ignitionSound.ts             synthesized launch "boom" (WebAudio, no files)
  lib/utils/time.ts                HH:MM:SS formatting
  components/CountdownDisplay.tsx  flip-clock cards with 3D digit animation
  components/LaunchButton.tsx      the Start button
  components/IgnitionBlast.tsx     the launch sequence overlay
  components/background/           original Demon Slayer × Stranger Things atmosphere
  App.tsx                          the entire page / state machine
```

The background layers `public/image.png` under a dark scrim (for text
contrast) plus a few small code-generated effects — floating particles,
dimensional cracks, slow fog drift. It degrades gracefully to a plain dark
gradient if the image ever fails to load.

## Scripts

```bash
npm run dev     # dev server
npm run build   # type-check + production build
npm run test    # run tests once
npm run lint    # eslint
```
