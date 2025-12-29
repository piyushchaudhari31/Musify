import { Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Register from './pages/Register'
import Home from './pages/Home'
import ArtistDashboard from './pages/artist/ArtistDashboard'
import Login from './pages/Login'
import MusicPlayer from './pages/music/MusicPlayer'
import UploadMusic from './pages/artist/UploadMusic'
import CreatePlaylist from './pages/artist/CreatePlaylist'
import Playlistcard from './pages/component/Playlistcard'
import PlaylistDetail from './pages/component/PlaylistDetail'
import ArtistDetail from './pages/artist/ArtistDetail'
import ArtistSong from './pages/artist/ArtistSong'


function App() {

  const [ socket, setSocket ] = useState(null)
  const url = "https://musify-17w2.onrender.com"

  useEffect(() => {

    const newSocket = io(`${url}`, {
      withCredentials: true,
    })

    setSocket(newSocket)

    newSocket.on("play", (data) => {
      const musicId = data.musicId
      window.location.href = `/music/${musicId}`
    })

  }, [])


  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route path='/music/:id' element={<MusicPlayer />}></Route>
          <Route path='/artist/dashboard/upload-music' element={<UploadMusic />}></Route>
          <Route path='/artist/dashboard/create-playlist' element={<CreatePlaylist />}></Route>
          <Route path='/playlist/:id' element={<Playlistcard />}></Route>
          <Route path='/playlist' element={<PlaylistDetail />}></Route>
          <Route path='/artist' element={<ArtistDetail />}></Route>
          <Route path='/artist/:id' element={<ArtistSong />}></Route>
        </Routes>
      </main>
    </div>

  )
}

export default App
