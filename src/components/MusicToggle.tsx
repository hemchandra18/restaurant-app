import { useState, useEffect } from 'react'
import {
    startMusic,
    stopMusic,
    setMusicVolume,
    isSfxMuted,
    setSfxMuted,
} from '../hooks/useSound'

function MusicToggle() {
    const MUSIC_KEY = 'stellar-bites-music'
    const VOLUME_KEY = 'stellar-bites-music-volume'

    const [musicOn, setMusicOn] = useState(() => {
        try { return localStorage.getItem(MUSIC_KEY) === 'on' } catch { return false }
    })

    const [volume, setVolume] = useState(() => {
        try {
            const v = localStorage.getItem(VOLUME_KEY)
            return v ? parseFloat(v) : 0.12
        } catch { return 0.12 }
    })

    const [sfxOff, setSfxOff] = useState(() => isSfxMuted())
    const [showPanel, setShowPanel] = useState(false)

    // Restore music on mount if was enabled
    useEffect(() => {
        if (musicOn) {
            const timer = setTimeout(() => startMusic(volume), 500)
            return () => clearTimeout(timer)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function toggleMusic() {
        const next = !musicOn
        setMusicOn(next)
        try { localStorage.setItem(MUSIC_KEY, next ? 'on' : 'off') } catch { /* */ }
        if (next) {
            startMusic(volume)
        } else {
            stopMusic()
        }
    }

    function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
        const v = parseFloat(e.target.value)
        setVolume(v)
        try { localStorage.setItem(VOLUME_KEY, String(v)) } catch { /* */ }
        if (musicOn) setMusicVolume(v)
    }

    function toggleSfx() {
        const next = !sfxOff
        setSfxOff(next)
        setSfxMuted(next)
    }

    return (
        <div className="music-toggle-wrapper">
            <button
                className="music-toggle-btn"
                onClick={() => setShowPanel(!showPanel)}
                title="Audio settings"
            >
                🎵
                <span className="music-toggle-label">Audio</span>
            </button>

            {showPanel && (
                <>
                    <div
                        className="audio-panel-backdrop"
                        onClick={() => setShowPanel(false)}
                    />
                    <div className="audio-panel">
                        <div className="audio-panel-title">Audio Settings</div>

                        {/* Music Toggle */}
                        <div className="audio-panel-row">
                            <span className="audio-panel-row-label">
                                🎶 Music
                            </span>
                            <button
                                className={`audio-pill ${musicOn ? 'audio-pill-on' : ''}`}
                                onClick={toggleMusic}
                            >
                                {musicOn ? 'On' : 'Off'}
                            </button>
                        </div>

                        {/* Music Volume */}
                        {musicOn && (
                            <div className="audio-panel-row">
                                <span className="audio-panel-row-label">
                                    Volume
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="0.3"
                                    step="0.005"
                                    value={volume}
                                    onChange={handleVolume}
                                    className="music-volume-slider"
                                />
                            </div>
                        )}

                        {/* SFX Toggle */}
                        <div className="audio-panel-row">
                            <span className="audio-panel-row-label">
                                🔊 Sound Effects
                            </span>
                            <button
                                className={`audio-pill ${!sfxOff ? 'audio-pill-on' : ''}`}
                                onClick={toggleSfx}
                            >
                                {sfxOff ? 'Off' : 'On'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default MusicToggle
