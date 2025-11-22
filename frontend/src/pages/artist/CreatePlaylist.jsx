import React, { useState, useEffect } from "react";
import "../artist/createplaylist.css";
import axios from "axios";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const Playlist = () => {

  const navigate = useNavigate()

  const [playlistData, setPlaylistData] = useState({
    title: "All Music",
    musics: [],
  });
  const [selectedMusics, setSelectedMusics] = useState([]);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:3000"

  useEffect(() => {
    axios
      .get(`${url}/api/music/`, { withCredentials: true })
      .then((res) => {
        setPlaylistData({
          title: "All Music",
          musics: res.data.musics || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching music:", err.response || err);
        setLoading(false);
      });
  }, []);

  const handleMusicClick = (id) => {
    setSelectedMusics((prev) =>
      prev.includes(id)
        ? prev.filter((mid) => mid !== id)
        : [...prev, id]
    );
  };

  const handleCreatePlaylist = () => {
     const newPlaylist = {
      title: playlistTitle.trim() || "Untitled Playlist",
      musics: selectedMusics,
    };
    axios.post(`${url}/api/music/playlist`, newPlaylist, { withCredentials: true })
      .then(res => toast.success("Create a Playlist"),navigate("/artist/dashboard")
      
    
    )
      .catch(err => console.error("❌ Error creating playlist:", err.response || err));
  };

  if (loading) return <div className="loading">Loading music...</div>;

  return (
    <div className="playlist-wrapper">
      <h2 className="heading">Create New Playlist</h2>

     
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter playlist title"
          value={playlistTitle}
          onChange={(e) => setPlaylistTitle(e.target.value)}
          className="title-input"
        />
      </div>

     
      <div className="music-list">
        {playlistData.musics.map((music) => {
          const isSelected = selectedMusics.includes(music._id);
          return (
            <div
              key={music._id}
              className={`music-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleMusicClick(music._id)}
            >
              <img
                src={music.coverImageUrl}
                alt={music.title}
                className="music-cover-playlist"
              />
              <p className="music-title">{music.title}</p>
              
            </div>
          );
        })}
      </div>

      <div className="selected-section">
        <h3>🎧 Selected Songs</h3>
        {selectedMusics.length === 0 ? (
          <p className="no-selected">No songs added yet.</p>
        ) : (
          <ul>
            {playlistData.musics
              .filter((m) => selectedMusics.includes(m._id))
              .map((m) => (
                <li key={m._id}>{m.title}</li>
              ))}
          </ul>
        )}
      </div>

      <div className="button-section">
        <button className="create-btn" onClick={handleCreatePlaylist}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Playlist;
