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
  const url = 'https://musify-17w2.onrender.com'
  const token = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`${url}/api/auth/check-auth`, { withCredentials: true})
      .then(res => {
        setIsLoggedIn(res.data.isLoggedIn)
        if (res.data.user) setUser(res.data.user)
      })
      .catch(() => setIsLoggedIn(false))
  }, [])

  async function fetchPlaylists() {
    try {
      const response = await axios.get(`${url}/api/music/playlist`, { withCredentials: true ,headers:{Authorization:token ? `Bearer ${token}`:undefined} })
      if (response.data.playlist) {
        setPlaylists(response.data.playlist.map(p => ({
          id: p._id,
          title: p.title,
          count: p.musics.length,
          artist: p.artist || ""
        })))
      }
    } catch (err) { }
  }

  async function fetchMusics() {
    const response = await axios.get(`${url}/api/music/`, { withCredentials: true , headers :{Authorization : token ? `Bearer ${token}` : undefined} })
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
      await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true ,headers: {Authorization :token ? `Bearer ${token}`:undefined} })
      setIsLoggedIn(false)
      setUser(null)
      navigate('/login')
    } else {
      navigate('/login')
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <div className="home-page">

          <header className="home-hero">
            <div className="brand-center">
              <h1 className="home-title">Musify</h1>
              <p className="home-tag">तुमचं स्वागत आहे</p>
            </div>
            <button className="btn btn-small logout-btn" onClick={handleAuthClick}>Logout</button>
          </header>
        
          <section className="home-section">
            <div className="section-head">
              <h2 className="section-title">Explore</h2>
            </div>
            <div className='Detail_explores'>
            <div className="playlist-grid-head">

              <div className="playlist-card" onClick={() => navigate("/playlist")}>
                <h3 className="playlist-title-head">Playlist</h3>
                <p className="playlist-meta">All playlist...</p>
              </div>

              <div className="playlist-card" onClick={() => navigate("/artist")}>
                <h3 className="playlist-title-head">Artists</h3>
                <p className="playlist-meta">Artist Detail...</p>
              </div>

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
                  <div key={m.id} className="music-card"
                    onClick={() => {
                      socket?.emit("play", { musicId: m.id })
                      navigate(`/music/${m.id}`, { state: { musics } })
                    }}>
                    <div className="music-cover-wrapping">
                      <img src={m.coverImageUrl} alt="" className="music-cover" />
                    </div>
                    <div className="music-info">
                      <h3 className="music-title">{m.title}</h3>
                      <p className="music-artist">{m.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      ) : (
        <div className="home-page notlog">
          <header className="home-hero">
            <div className="brand-center">
              <h1 className="home-title">Musify</h1>
            </div>
            <button className="btn btn-small logout-btn" onClick={handleAuthClick}>Sign In</button>
          </header>
          <p className="advice">Login First</p>
        </div>
      )}
    </div>
  )
}
