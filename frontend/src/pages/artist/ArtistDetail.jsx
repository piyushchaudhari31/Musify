import axios from "axios";
import React, { useEffect, useState } from "react";
import './artistdeatil.css'
import { useNavigate } from "react-router-dom";

const ArtistDetail = ()=>{

  const [artists, setArtists] = useState([]);
  const url = "https://musify-17w2.onrender.com";
  const navigate = useNavigate(); 

  async function getArtistDetail() {
    try {
      const response = await axios.get(`${url}/api/music/artist`, { withCredentials: true });
      setArtists(response.data.user || []);
    } catch (err) { console.log("Error fetching artist"); }
  }

  useEffect(() => {
    getArtistDetail();
  }, []);

  const handleArtistClick = (artist)=> {
    navigate(`/artist/${artist._id}`);  
  };

  return (
    <div className="artist-container">

      <h2 className="artist-heading">Artists</h2>

      <div className="artist-grid">
        {artists.map((a, index) => (
          <div 
            key={index} 
            className="artist-card"
            onClick={()=> handleArtistClick(a)}   
          >
            <h3 className="artist-name">{a.fullName?.firstName}</h3>
            <p className="artist-lastname">{a.fullName?.lastName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtistDetail;
