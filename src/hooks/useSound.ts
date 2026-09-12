// ============================================
// Stellar Bites — Sci-Fi Sound Design System v2
// ============================================
// Playful, rounded, "boop/blip/pop" sci-fi sounds
// synthesized via Web Audio API. Zero external files.
// Inspired by social-deduction space game aesthetics
// but 100% original synthesis — no copyrighted audio.

let audioCtx: AudioContext | null = null

function ctx(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }
    return audioCtx
}

// ---------- SFX Mute State ----------

const SFX_MUTE_KEY = 'stellar-bites-sfx-muted'

let sfxMuted = (() => {
    try { return localStorage.getItem(SFX_MUTE_KEY) === 'true' } catch { return false }
})()

export function isSfxMuted() { return sfxMuted }

export function setSfxMuted(muted: boolean) {
    sfxMuted = muted
    try { localStorage.setItem(SFX_MUTE_KEY, String(muted)) } catch { /* */ }
}

// ---------- Helpers ----------

/** Create a soft waveshaper for warm saturation */
function makeWarmShaper(ac: AudioContext, amount: number = 2): WaveShaperNode {
    const shaper = ac.createWaveShaper()
    const samples = 256
    const curve = new Float32Array(samples)
    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x))
    }
    shaper.curve = curve
    shaper.oversample = '2x'
    return shaper
}

/** Low-pass filter for roundedness */
function makeLPF(ac: AudioContext, freq: number): BiquadFilterNode {
    const f = ac.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = freq
    f.Q.value = 1
    return f
}

// ---------- Sound Effects ----------

/**
 * Rounded sci-fi "boop" — short, low-pitched, squishy click.
 * Character: like tapping a control panel on a spaceship.
 */
function playClick() {
    if (sfxMuted) return
    try {
        const ac = ctx()
        const t = ac.currentTime

        const osc = ac.createOscillator()
        const osc2 = ac.createOscillator()
        const gain = ac.createGain()
        const lpf = makeLPF(ac, 800)
        const shaper = makeWarmShaper(ac, 3)

        // Main tone: rounded sine boop
        osc.type = 'sine'
        osc.frequency.setValueAtTime(340, t)
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.08)

        // Sub harmonic for body
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(170, t)
        osc2.frequency.exponentialRampToValueAtTime(90, t + 0.08)

        gain.gain.setValueAtTime(0.18, t)
        gain.gain.setValueAtTime(0.18, t + 0.015)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)

        osc.connect(shaper)
        osc2.connect(shaper)
        shaper.connect(lpf)
        lpf.connect(gain)
        gain.connect(ac.destination)

        osc.start(t)
        osc2.start(t)
        osc.stop(t + 0.12)
        osc2.stop(t + 0.12)
    } catch { /* */ }
}

/**
 * Playful rising "bwoop" — add to cart.
 * Character: cheerful ascending bubble pop, like picking up an item.
 */
function playAddToCart() {
    if (sfxMuted) return
    try {
        const ac = ctx()
        const t = ac.currentTime

        const osc = ac.createOscillator()
        const osc2 = ac.createOscillator()
        const modOsc = ac.createOscillator()
        const modGain = ac.createGain()
        const gain = ac.createGain()
        const lpf = makeLPF(ac, 1200)
        const shaper = makeWarmShaper(ac, 2)

        // Main rising sweep
        osc.type = 'sine'
        osc.frequency.setValueAtTime(180, t)
        osc.frequency.exponentialRampToValueAtTime(520, t + 0.1)
        osc.frequency.exponentialRampToValueAtTime(480, t + 0.18)

        // Harmonic layer
        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(270, t)
        osc2.frequency.exponentialRampToValueAtTime(780, t + 0.1)
        osc2.frequency.exponentialRampToValueAtTime(720, t + 0.18)

        // FM vibrato for squishiness
        modOsc.type = 'sine'
        modOsc.frequency.setValueAtTime(30, t)
        modGain.gain.setValueAtTime(15, t)
        modOsc.connect(modGain)
        modGain.connect(osc.frequency)

        gain.gain.setValueAtTime(0.001, t)
        gain.gain.linearRampToValueAtTime(0.16, t + 0.02)
        gain.gain.setValueAtTime(0.16, t + 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)

        osc.connect(shaper)
        osc2.connect(shaper)
        shaper.connect(lpf)
        lpf.connect(gain)
        gain.connect(ac.destination)

        osc.start(t)
        osc2.start(t)
        modOsc.start(t)
        osc.stop(t + 0.22)
        osc2.stop(t + 0.22)
        modOsc.stop(t + 0.22)
    } catch { /* */ }
}

/**
 * Soft descending "bwop" — remove/decrease from cart.
 * Character: gentle deflating bubble, sad but cute.
 */
function playRemoveFromCart() {
    if (sfxMuted) return
    try {
        const ac = ctx()
        const t = ac.currentTime

        const osc = ac.createOscillator()
        const gain = ac.createGain()
        const lpf = makeLPF(ac, 700)
        const shaper = makeWarmShaper(ac, 2)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(380, t)
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.15)

        gain.gain.setValueAtTime(0.12, t)
        gain.gain.setValueAtTime(0.12, t + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)

        osc.connect(shaper)
        shaper.connect(lpf)
        lpf.connect(gain)
        gain.connect(ac.destination)

        osc.start(t)
        osc.stop(t + 0.18)
    } catch { /* */ }
}

/**
 * Cheerful ascending "boop-boop-bweeep" — order success jingle.
 * Character: happy task-complete fanfare, 3 ascending rounded notes
 * followed by a satisfied sustain.
 */
function playSuccess() {
    if (sfxMuted) return
    try {
        const ac = ctx()
        const t = ac.currentTime

        // Three ascending boops + final sustain
        const notes = [
            { freq: 262, start: 0, dur: 0.12, vol: 0.14 },    // C4 boop
            { freq: 330, start: 0.1, dur: 0.12, vol: 0.14 },   // E4 boop
            { freq: 392, start: 0.2, dur: 0.12, vol: 0.15 },   // G4 boop
            { freq: 523, start: 0.3, dur: 0.35, vol: 0.12 },   // C5 sustain
        ]

        const lpf = makeLPF(ac, 1400)
        const shaper = makeWarmShaper(ac, 2)
        const masterGain = ac.createGain()
        masterGain.gain.setValueAtTime(1, t)

        shaper.connect(lpf)
        lpf.connect(masterGain)
        masterGain.connect(ac.destination)

        notes.forEach(({ freq, start, dur, vol }) => {
            const osc = ac.createOscillator()
            const osc2 = ac.createOscillator()
            const g = ac.createGain()
            const noteStart = t + start

            // Main note with pitch bend up
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq * 0.85, noteStart)
            osc.frequency.exponentialRampToValueAtTime(freq, noteStart + 0.03)

            // Soft harmonic
            osc2.type = 'triangle'
            osc2.frequency.setValueAtTime(freq * 1.5, noteStart)
            osc2.detune.setValueAtTime(-5, noteStart)

            g.gain.setValueAtTime(0.001, noteStart)
            g.gain.linearRampToValueAtTime(vol, noteStart + 0.015)
            g.gain.setValueAtTime(vol, noteStart + dur * 0.4)
            g.gain.exponentialRampToValueAtTime(0.001, noteStart + dur)

            osc.connect(g)
            osc2.connect(g)
            g.connect(shaper)

            osc.start(noteStart)
            osc2.start(noteStart)
            osc.stop(noteStart + dur)
            osc2.stop(noteStart + dur)
        })
    } catch { /* */ }
}

/**
 * Double-boop notification — admin status change.
 * Character: two short rounded pips, like a spaceship comm chirp.
 */
function playStatusChange() {
    if (sfxMuted) return
    try {
        const ac = ctx()
        const t = ac.currentTime

        const lpf = makeLPF(ac, 900)
        const shaper = makeWarmShaper(ac, 2)
        const masterGain = ac.createGain()
        masterGain.gain.setValueAtTime(1, t)
        shaper.connect(lpf)
        lpf.connect(masterGain)
        masterGain.connect(ac.destination)

        const pips = [
            { freq: 280, start: 0, endFreq: 220 },
            { freq: 350, start: 0.09, endFreq: 300 },
        ]

        pips.forEach(({ freq, start, endFreq }) => {
            const osc = ac.createOscillator()
            const g = ac.createGain()
            const s = t + start

            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, s)
            osc.frequency.exponentialRampToValueAtTime(endFreq, s + 0.06)

            g.gain.setValueAtTime(0.001, s)
            g.gain.linearRampToValueAtTime(0.13, s + 0.01)
            g.gain.setValueAtTime(0.13, s + 0.03)
            g.gain.exponentialRampToValueAtTime(0.001, s + 0.1)

            osc.connect(g)
            g.connect(shaper)

            osc.start(s)
            osc.stop(s + 0.1)
        })
    } catch { /* */ }
}

// ---------- Sound Map ----------

export type SoundName =
    | 'click'
    | 'addToCart'
    | 'removeFromCart'
    | 'success'
    | 'statusChange'

const soundMap: Record<SoundName, () => void> = {
    click: playClick,
    addToCart: playAddToCart,
    removeFromCart: playRemoveFromCart,
    success: playSuccess,
    statusChange: playStatusChange,
}

/** Play a named sound effect. Safe to call anywhere. */
export function playSound(name: SoundName) {
    soundMap[name]?.()
}

// ============================================
// Ambient Background Music — "Spaceship Lounge"
// ============================================
// Warm, calm, minimal ambient pad.
// Think: elegant space-lounge, not game soundtrack.
// Uses a warm Fmaj9 voicing with very slow movement,
// filtered to keep only the softest frequencies.
// Seamlessly loops via continuous oscillators.

let musicNodes: {
    oscillators: OscillatorNode[]
    masterGain: GainNode
    filter: BiquadFilterNode
    lfo: OscillatorNode
    lfo2: OscillatorNode
} | null = null

let musicPlaying = false

function createAmbientMusic() {
    try {
        const ac = ctx()
        const t = ac.currentTime

        // Master gain — starts at 0 (silent)
        const masterGain = ac.createGain()
        masterGain.gain.setValueAtTime(0, t)

        // Warm low-pass filter — cuts everything harsh
        const filter = ac.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(400, t)
        filter.Q.value = 0.5

        // Subtle high-pass to remove rumble
        const hpf = ac.createBiquadFilter()
        hpf.type = 'highpass'
        hpf.frequency.setValueAtTime(60, t)
        hpf.Q.value = 0.5

        filter.connect(hpf)
        hpf.connect(masterGain)
        masterGain.connect(ac.destination)

        // Warm Fmaj9 voicing — dreamy, consonant, spa-like
        // F2, A2, C3, E3, G3 — very spread, low register
        const voices = [
            { freq: 87.31, type: 'sine' as OscillatorType, vol: 0.10, detune: 0 },     // F2
            { freq: 110.0, type: 'sine' as OscillatorType, vol: 0.08, detune: 3 },     // A2
            { freq: 130.81, type: 'sine' as OscillatorType, vol: 0.07, detune: -3 },   // C3
            { freq: 164.81, type: 'triangle' as OscillatorType, vol: 0.04, detune: 5 }, // E3
            { freq: 196.0, type: 'triangle' as OscillatorType, vol: 0.03, detune: -4 }, // G3
            // Doubled octave-below root for warmth
            { freq: 43.65, type: 'sine' as OscillatorType, vol: 0.06, detune: 0 },     // F1
        ]

        const oscillators: OscillatorNode[] = []

        voices.forEach(({ freq, type, vol, detune }) => {
            const osc = ac.createOscillator()
            const g = ac.createGain()

            osc.type = type
            osc.frequency.setValueAtTime(freq, t)
            osc.detune.setValueAtTime(detune, t)

            g.gain.setValueAtTime(vol, t)

            osc.connect(g)
            g.connect(filter)
            osc.start(t)

            oscillators.push(osc)
        })

        // Very slow LFO for gentle pitch drift — creates "breathing" feel
        const lfo = ac.createOscillator()
        const lfoGain = ac.createGain()
        lfo.type = 'sine'
        lfo.frequency.setValueAtTime(0.04, t) // One cycle every 25 seconds
        lfoGain.gain.setValueAtTime(1.5, t)   // Very subtle detune
        lfo.connect(lfoGain)
        oscillators.forEach(osc => lfoGain.connect(osc.detune))
        lfo.start(t)

        // Second LFO for filter cutoff movement — warm swell
        const lfo2 = ac.createOscillator()
        const lfo2Gain = ac.createGain()
        lfo2.type = 'sine'
        lfo2.frequency.setValueAtTime(0.025, t) // One cycle every 40 seconds
        lfo2Gain.gain.setValueAtTime(80, t)     // Filter moves 320-480Hz
        lfo2.connect(lfo2Gain)
        lfo2Gain.connect(filter.frequency)
        lfo2.start(t)

        musicNodes = { oscillators, masterGain, filter, lfo, lfo2 }
    } catch { /* */ }
}

export function startMusic(volume: number = 0.12) {
    if (musicPlaying) return
    try {
        const ac = ctx()
        if (!musicNodes) createAmbientMusic()
        if (musicNodes) {
            const g = musicNodes.masterGain.gain
            g.cancelScheduledValues(ac.currentTime)
            g.setValueAtTime(g.value, ac.currentTime)
            // Very slow 3-second fade in for smoothness
            g.linearRampToValueAtTime(volume, ac.currentTime + 3)
            musicPlaying = true
        }
    } catch { /* */ }
}

export function stopMusic() {
    if (!musicPlaying || !musicNodes) return
    try {
        const ac = ctx()
        const g = musicNodes.masterGain.gain
        g.cancelScheduledValues(ac.currentTime)
        g.setValueAtTime(g.value, ac.currentTime)
        // 2-second fade out
        g.linearRampToValueAtTime(0, ac.currentTime + 2)
        musicPlaying = false
    } catch { /* */ }
}

export function setMusicVolume(volume: number) {
    if (!musicNodes) return
    try {
        const ac = ctx()
        const g = musicNodes.masterGain.gain
        g.cancelScheduledValues(ac.currentTime)
        g.setValueAtTime(g.value, ac.currentTime)
        g.linearRampToValueAtTime(volume, ac.currentTime + 0.5)
    } catch { /* */ }
}

export function isMusicPlaying() { return musicPlaying }

// ---------- Unused hook kept for API compat ----------
export function useSound() {
    return { play: playSound }
}
