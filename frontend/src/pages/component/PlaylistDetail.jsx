import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./playlistDetail.css"; 

export default function PlaylistDetail() {

  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"))

  const url = "https://musify-17w2.onrender.com";

  async function fetchPlaylists() {
    try {
      const response = await axios.get(`${url}/api/music/playlist`, { withCredentials: true , headers :{ Authorization :token? `Bearer ${token}` : undefined} })
      if (response.data.playlist) {
        setPlaylists(response.data.playlist.map(p => ({
          id: p._id,
          title: p.title,
          count: p.musics.length,
          artist: p.artist || ""
        })))
      }
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="home-page">

      <button className="back-btn" onClick={() => navigate(-1)}>◀ Back</button>

      <section className="home-section">
        <div className="section-head">
          <h2 className="section-title">Playlists</h2>
        </div>

        <div className="playlist_Session">
          <div className="playlist-grid-head">
            {playlists.length > 0 ? playlists.map(p => (
              <div
                key={p.id}
                className="playlist-card"
                onClick={() => navigate(`/playlist/${p.id}`)}
              >
                <div className="playlist-info">
                  <h3 className="playlist-title-head">{p.title}</h3>
                  <p className="playlist-meta">{p.count} Tracks</p>
                  {p.artist && <p className="text-muted">{p.artist}</p>}
                </div>
              </div>
            )) :
              <p className="text-muted">No Playlists Available</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
