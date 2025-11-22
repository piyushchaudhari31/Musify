import React, { useEffect, useState } from 'react'
import '../pages/home.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Home({ socket }) {
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const [musics, setMusics] = useState([])
  const [playlists, setPlaylists] = useState([])
  const url = 'https://musify-mxwi.onrender.com'

  useEffect(() => {
    axios.get(`${url}/api/auth/check-auth`, { withCredentials: true })
      .then(res => {
        setIsLoggedIn(res.data.isLoggedIn)
        if (res.data.user) setUser(res.data.user)
      })
      .catch(() => setIsLoggedIn(false))
  }, [])


  async function fetchPlaylists() {
    try {
      const response = await axios.get(`${url}/api/music/playlist`, { withCredentials: true })
      if (response.data.playlist) {
        setPlaylists(response.data.playlist.map(p => ({
          id: p._id,
          title: p.title,
          count: p.musics.length,
          artist: p.artist || ""
        })))
      }
    } catch (err) {
      console.error("Failed to fetch playlists:", err)
    }
  }


  async function fetchMusics() {
    const response = await axios.get(`${url}/api/music/`, { withCredentials: true })


    if (response.data.musics) {
      setMusics(response.data.musics.map(m => ({
        id: m._id,
        title: m.title,
        artist: m.artist,
        coverImageUrl: m.coverImageUrl,
        musicUrl: m.musicUrl,
      })))
    }
  }

  useEffect(() => {
    fetchPlaylists()
    fetchMusics()
  }, [])

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true })
      setIsLoggedIn(false)
      setUser(null)
      navigate('/login')
    } else {
      navigate('/login')
    }
  }

  return (
    <div>
      {isLoggedIn ? <><div className="home-page stack" style={{ gap: '1.5rem' }}>
        <header className="home-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="home-title">Musify</h1>
            <p className="text-muted home-tag">तुमचं स्वागत आहे</p>
          </div>

          <button className="btn btn-small" onClick={handleAuthClick}>
            {isLoggedIn ? 'Logout' : 'Sign In'}
          </button>
        </header>

        <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Playlists</h2>
          </div>
          <div className="playlist_Session">
            <div className="playlist-grid-head">
            {playlists.map(p => (
              <div
                key={p.id}
                className="playlist-card surface"
                tabIndex={0}
                onClick={() => navigate(`/playlist/${p.id}`)}
              >
                <div className="playlist-info">
                  <h3 className="playlist-title-head" title={p.title}>{p.title}</h3>
                  <p className="playlist-meta text-muted">{p.count} tracks</p>
                  {p.artist && <p className="text-muted">{p.artist}</p>}
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Musics</h2>
          </div>
          <div className="music_session">
            <div className="music-grid">
              {musics.map(m => (
                <div
                  key={m.id}
                  className="music-card surface"
                  tabIndex={0}
                  onClick={() => {
                    socket?.emit("play", { musicId: m.id })
                    navigate(`/music/${m.id}`,{state:{musics}})
                  }}
                >
                  <div className="music-cover-wrapping">
                    <img src={m.coverImageUrl} alt="" className="music-cover" />
                  </div>
                  <div className="music-info">
                    <h3 className="music-title" title={m.title}>{m.title}</h3>
                    <p className="music-artist text-muted" title={m.artist}>{m.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div></> :
        <div className='home-page stack'>
          <header className="home-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="home-title">Musify</h1>
              <p className="text-muted home-tag">तुमचं स्वागत आहे</p>
            </div>

            <button className="btn btn-small" onClick={handleAuthClick}>
              {isLoggedIn ? 'Logout' : 'Sign In'}
            </button>
          </header>
          <p>Login First</p>
        </div>}



    </div>
  )
}
