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


function App() {

  const [ socket, setSocket ] = useState(null)
  const url = "http://localhost:3000"

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
        </Routes>
      </main>
    </div>

  )
}

export default App
