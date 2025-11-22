import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../artist/artistdashboard.css'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ArtistDashboard() {
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [musics, setMusics] = useState([])
  const [playlists, setPlaylists] = useState([])
  const url = "http://localhost:3000"

  const formatDateTime = (d) => {
    return new Date(d).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    axios
      .get(`${url}/api/auth/check-auth`, { withCredentials: true })
      .then(res => {
        if (res.data.isLoggedIn) {
          setIsLoggedIn(true)
          setUser(res.data.user)
        } else {
          navigate('/login')
        }
      })
      .catch(() => {
        setIsLoggedIn(false)
        navigate('/login')
      })
  }, [navigate])

  const handleLogout = async () => {
    try {
      await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true })
      setIsLoggedIn(false)
      setUser(null)
      navigate('/login')
      toast.success("Log out Successfully")
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return

    axios
      .get(`${url}/api/music/artist-music`, { withCredentials: true })
      .then((res) => {
        setMusics(
          res.data.musics.map((m) => ({
            id: m._id || m.id,
            title: m.title,
            artist: m.artist,
            coverImageUrl: m.coverImageUrl || m.coverimage || m.coverimageUrl || m.coverImageKey,
            musicUrl: m.musicUrl,
            plays: m.plays || 0,
            duration: m.duration || '3:00',
            updatedAt: m.uploadedAt
          }))
        )
      })
      .catch((err) => console.error('Error fetching musics:', err))

    axios
      .get(`${url}/api/music/playlist/artist`, { withCredentials: true })
      .then((res) => {
        const playlistData = res.data.playlists || []
        setPlaylists(
          playlistData.map((p) => ({
            id: p._id || p.id,
            title: p.title,
            artist: p.artist,
            updatedAt: p.uploadedAt,
            musics: p.musics || [],
          }))
        )
      })
      .catch((err) => console.error('Error fetching playlists:', err))
  }, [isLoggedIn])

  const musicMap = Object.fromEntries(
    musics.flatMap((m) => [
      [m.id, m],
      [m._id, m]
    ])
  )

  if (!isLoggedIn) return null

  const getMusic = (musicId) => {
    navigate(`/music/${musicId}`)
  }

  const Getplaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`)
  }

  return (
    <div className="artist-dashboard stack" style={{ gap: 'var(--space-8)' }}>
      <header className="dashboard-header">
        <div>
          <h1 className="dash-title">Artist Dashboard</h1>
          <p className="text-muted dash-sub">
            Welcome {user?.fullName?.firstName || ''} 👋 — overview of your content performance
          </p>
        </div>
        <div className="dashboard-actions inline">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/artist/dashboard/upload-music')}
          >
            + New Track
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)'
            }}
            onClick={() => navigate('/artist/dashboard/create-playlist')}
          >
            + New Playlist
          </button>
          <button type="button" className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="data-panels">
        <div className="data_pannel_inside">
          <div className="panel surface">
            <h3 className="panel-title">Musics</h3>
            <p className="metric">{musics.length}</p>
          </div>
          <div className="panel surface">
            <h3 className="panel-title">Playlists</h3>
            <p className="metric">{playlists.length}</p>
          </div>
        </div>
      </section>

      <div className="grid-sections">
        <section className="tracks-section surface">
          <div className="section-head">
            <h2 className="section-title">Musics</h2>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Title</th>
                  <th>Artist</th>
                  <th>Duration</th>
                  <th>Released</th>
                </tr>
              </thead>
              <tbody>
                {musics.map((m) => (
                  <tr key={m.id || m._id} onClick={() => getMusic(m.id)} style={{ cursor: 'pointer' }}>
                    <td className="title-cell">
                      <div className="music-cell">
                        <img src={m.coverImageUrl} alt="" className="music-cover" />
                        <div className="music-meta">
                          <span className="music-title">{m.title}</span>
                          <span className="music-artist text-muted">{m.artist}</span>
                        </div>
                      </div>
                    </td>
                    <td>{m.artist}</td>
                    <td>{m.duration}</td>
                    <td className='Time'>{formatDateTime(m.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="playlists-section surface">
          <div className="section-head">
            <h2 className="section-title">Playlists</h2>
          </div>
          <ul className="playlist-list">
            {playlists.map((p) => {
              const resolvedMusics = p.musics
                .map((m) => {
                  if (typeof m === 'string') return musicMap[m]
                  if (m && (m._id || m.id) && (musicMap[m._id] || musicMap[m.id]))
                    return musicMap[m._id] || musicMap[m.id]
                  return m
                })
                .filter(Boolean)

              return (
                <li key={p.id || p._id} className="playlist-item" onClick={() => Getplaylist(p.id)}>
                  <div className="playlist-top">
                    <div className="playlist-cover-collage" aria-hidden>
                      {resolvedMusics.slice(0, 4).map((m, idx) => (
                        <img
                          key={`${m.id || m._id || 'music'}-${idx}`}
                          src={m.coverImageUrl || m.coverImageKey}
                          alt={m.title || 'cover'}
                        />
                      ))}
                    </div>
                    <div className="playlist-meta">
                      <span className="playlist-name">{p.title}</span>
                      <span className="playlist-updated text-muted">
                        Updated {formatDateTime(p.updatedAt)} - {p.artist}
                      </span>
                    </div>
                  </div>
                  <div className="playlist-stats">
                    <span>{resolvedMusics.length} musics</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
