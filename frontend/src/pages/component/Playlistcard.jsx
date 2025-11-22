import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../component/playlistcard.css'; // ✅ import CSS file

const Playlistcard = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [musics, setMusics] = useState([]);
  const url = "https://musify-mxwi.onrender.com"
  const navigate = useNavigate()
  
  async function getPlaylist() {
    try {
      const response = await axios.get(`${url}/api/music/playlist/${id}`, {
        withCredentials: true,
      });
      const data = response.data.playlist;
      
      setPlaylist(data);

      // Fetch music details for each music ID
      if (data.musics && data.musics.length > 0) {
        const musicDetails = await Promise.all(
          data.musics.map(async (musicId) => {
            const res = await axios.get(`${url}/api/music/get-detail/${musicId}`, {
              withCredentials: true,
            });
            return res.data.music;
          })
        );
        setMusics(musicDetails);
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  }

  useEffect(() => {
    getPlaylist();
  }, [id]);

  const GetMusicid = (musicId)=>{
    navigate(`/music/${musicId}`)
    
    
  }

  return (
    <div className="playlist-container">
      {playlist ? (
        <>
          <div className="playlist-header">
            <h2 className="playlist-title">{playlist.title}</h2>
            <p className="playlist-artist">Artist: {playlist.artist}</p>
          </div>

          <h3 className="tracks-heading">Tracks</h3>

          {musics.length > 0 ? (
            <div className="tracks-grid">
              {musics.map((music) => (
                <div key={music._id} className="track-card" onClick={()=>GetMusicid(music._id)}>
                  <img
                    src={music.coverImageKey || '/default-music.jpg'}
                    alt={music.title}
                    className="track-thumbnail"
                  />
                  <h4 className="track-title">{music.title}</h4>
                  <p className="track-artist">{music.artist}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="loading-text">Loading music details...</p>
          )}
        </>
      ) : (
        <p className="loading-text">Loading playlist...</p>
      )}
    </div>
  );
};

export default Playlistcard;
