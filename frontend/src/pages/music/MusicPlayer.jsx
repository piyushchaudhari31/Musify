import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import '../music/musicplayer.css'
import axios from 'axios'

export default function MusicPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  
  const musicList = location.state?.musics || []

  const [track, setTrack] = useState(null)

  const url = "https://musify-mxwi.onrender.com"

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [playbackRate, setPlaybackRate] = useState(1)

  const formatTime = useCallback((s) => {
    if (!Number.isFinite(s)) return '0:00'
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }, [])

  const handleLoadedMetadata = () => {
    const d = audioRef.current?.duration
    if (d) setDuration(d)
  }

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        console.error('Play error:', err)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const handleProgressChange = (e) => {
    const time = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value)
    setVolume(val)
    if (audioRef.current) audioRef.current.volume = val
  }

  const handleRateChange = (e) => {
    const val = Number(e.target.value)
    setPlaybackRate(val)
    if (audioRef.current) audioRef.current.playbackRate = val
  }

  const currentIndex = musicList.findIndex(m => m.id === id)

  const playNext = () => {
    if (currentIndex < musicList.length - 1) {
      const nextId = musicList[currentIndex + 1].id
      navigate(`/music/${nextId}`, { state: { musics: musicList } })
    }
  }

  const playPrev = () => {
    if (currentIndex > 0) {
      const prevId = musicList[currentIndex - 1].id
      navigate(`/music/${prevId}`, { state: { musics: musicList } })
    }
  }

  
  useEffect(() => {
    axios
      .get(`${url}/api/music/get-detail/${id}`, { withCredentials: true })
      .then(res => {
        setTrack(res.data.music)
        setIsPlaying(false)
        setCurrentTime(0)
      })
      .catch(err => console.error(err))
  }, [id])

  
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate
  }, [playbackRate])

  
  useEffect(() => {
    if (audioRef.current) {
      const autoPlay = async () => {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (err) {
          console.log("Autoplay blocked:", err)
        }
      }
      autoPlay()
    }
  }, [track]) 

  if (!track) return <div className="loading">Loading...</div>

  return (
    <div className="music-player-page">
      <header className="player-header">

       
        <button className="btn btn-small" onClick={() => navigate('/')}>← Back</button>

        <h1 className="player-title">{track.title}</h1>
      </header>

      <div className="player-layout">
        <div className="cover-pane">
          <img
            src={track.coverImageKey}
            alt={track.title}
            className="player-cover"
          />
        </div>

        <div className="controls-pane">
          <div className="track-meta">
            <h2 className="track-name">{track.title}</h2>
            <p className="track-artist text-muted">{track.artist}</p>
          </div>

          <audio
            ref={audioRef}
            src={track.musicKey}
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={playNext}   
          />

          <div className="transport">
            <div className="time-row">
              <span>{formatTime(currentTime)}</span>

              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={handleProgressChange}
                className="progress-bar"
              />

              <span>{formatTime(duration)}</span>
            </div>

            <div className="buttons-row">

              
              <button
                className="btn btn-small"
                onClick={playPrev}
                disabled={currentIndex === 0}
              >
                ⏮ Prev
              </button>

              <button className="btn btn-primary play-btn" onClick={togglePlay}>
                {isPlaying ? '⏸ Pause' : '▶️ Play'}
              </button>

              
              <button
                className="btn btn-small"
                onClick={playNext}
                disabled={currentIndex === musicList.length - 1}
              >
                Next ⏭
              </button>

            </div>
          </div>

          <div className="sliders">
            <div className="slider-group">
              <label htmlFor="volume">Volume: {Math.round(volume * 100)}%</label>
              <input
                id="volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>

            <div className="slider-group">
              <label htmlFor="rate">Speed: {playbackRate}x</label>
              <input
                id="rate"
                type="range"
                min={0.5}
                max={2}
                step={0.25}
                value={playbackRate}
                onChange={handleRateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
