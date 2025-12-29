import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./artistsong.css";

const ArtistSong = () => {

  const { id } = useParams();             
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const url = "https://musify-17w2.onrender.com";
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"))

  async function getArtistDetail(){
    try {
      const response = await axios.get(`${url}/api/music/artist/${id}`,{withCredentials:true , headers : {Authorization:token ? `Bearer ${token}`:undefined}});
      
      setArtist(response.data.artist || response.data);
      setSongs(response.data.musics || response.data.songs);
      
    } catch (error) {
      console.log("Error Fetching Artist",error);
    }
  }

  useEffect(()=>{ getArtistDetail() },[id]);

  return (
    <div className="artistSong-container">

      <button className="back-btn" onClick={()=>window.history.back()}>◀ Back</button>

      {artist ? (
        <>
          <div className="artistSong-header">
            <h1>{artist.fullName?.firstName} {artist.fullName?.lastName}</h1>
          </div>

          <h2 className="song-section-title">Songs</h2>

          <div className="songs-track">
            <div className="music-grid">

              {songs?.map((s,index)=>(

                <div 
                  key={index} 
                  className="music-card"
                  onClick={() => navigate(`/music/${s._id || s.id}`,{
                    state:{ musics: songs.map(m=>({id:m._id || m.id})) }  // Final working code ✔
                  })}
                >

                  <div className="music-cover-wrapping">
                    <img src={s.coverImageUrl || s.coverImageKey} className="music-cover"/>
                  </div>

                  <div className="music-info">
                    <h3 className="music-title">{s.title}</h3>
                    <p className="music-artist">{s.artist}</p>
                  </div>

                </div>
              ))}

            </div>
          </div>
        </>
      ) : <h3 className="loading">Loading Artist...</h3>}
    </div>
  );
};

export default ArtistSong;
