let audioContext;
let ringOscillator = null;
let ringGain = null;
let ringTimer = null;

function getCtx() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function playRingTone() {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
  stopRingTone();

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  filter.type = "bandpass";
  filter.frequency.value = 880;
  filter.Q.value = 6;
  gain.gain.value = 0.22;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();

  // ring pattern: two pulses then pause
  const pulses = [
    { start: 0, dur: 0.5 },
    { start: 0.65, dur: 0.5 },
  ];
  const schedule = () => {
    const t0 = ctx.currentTime;
    pulses.forEach((p) => {
      gain.gain.setValueAtTime(0, t0 + p.start);
      gain.gain.linearRampToValueAtTime(0.22, t0 + p.start + 0.02);
      gain.gain.setValueAtTime(0.22, t0 + p.start + p.dur - 0.05);
      gain.gain.linearRampToValueAtTime(0, t0 + p.start + p.dur);
    });
  };
  schedule();
  ringTimer = setInterval(() => {
    if (ctx.state === "suspended") return;
    schedule();
  }, 1800);

  ringOscillator = oscillator;
  ringGain = gain;
}

export function stopRingTone() {
  if (ringTimer) {
    clearInterval(ringTimer);
    ringTimer = null;
  }
  if (ringOscillator) {
    try {
      ringOscillator.stop();
    } catch {}
    ringOscillator = null;
  }
  if (ringGain) {
    try {
      ringGain.disconnect();
    } catch {}
    ringGain = null;
  }
}