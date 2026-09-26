// A short paper "swish" for the Saptahik reader's page turns, synthesized
// with Web Audio so there's no sound file to load. Browsers only allow audio
// after a user gesture; page turns always come from one (click, key, swipe).
let ctx;
let lastPlayed = 0;

function noiseBuffer(context, seconds) {
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * seconds), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    // Fast attack, then a decaying rustle with a little flutter in it.
    const envelope = Math.min(t / 0.04, 1) * (1 - t) ** 2.2;
    const flutter = 0.7 + 0.3 * Math.sin(t * 90 + Math.random() * 0.6);
    data[i] = (Math.random() * 2 - 1) * envelope * flutter;
  }
  return buffer;
}

export function playPageTurn() {
  const now = performance.now();
  // Dragging the page slider fires many turns; don't machine-gun the sound.
  if (now - lastPlayed < 120) return;
  lastPlayed = now;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    ctx ??= new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    const start = ctx.currentTime;
    const duration = 0.32;

    const swish = ctx.createBufferSource();
    swish.buffer = noiseBuffer(ctx, duration);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.9;
    band.frequency.setValueAtTime(1800, start);
    band.frequency.exponentialRampToValueAtTime(4200, start + duration * 0.35);
    band.frequency.exponentialRampToValueAtTime(1200, start + duration);
    const gain = ctx.createGain();
    gain.gain.value = 0.28;
    swish.connect(band).connect(gain).connect(ctx.destination);
    swish.start(start);

    // The soft "flap" of the page landing.
    const flap = ctx.createBufferSource();
    flap.buffer = noiseBuffer(ctx, 0.08);
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 700;
    const flapGain = ctx.createGain();
    flapGain.gain.value = 0.35;
    flap.connect(low).connect(flapGain).connect(ctx.destination);
    flap.start(start + duration * 0.7);
  } catch {
    // Sound is a nicety; never let it break page turning.
  }
}
