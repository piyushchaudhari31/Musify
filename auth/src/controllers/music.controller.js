const { uploadSong } = require('../services/storage.service.js')
const musicModel = require('../models/music.model.js')
const { v4: uuid } = require('uuid')
const playlistModel = require('../models/playlist.model.js')

async function MusicController(req, res) {
  try {
    const musicFile = req.files['music']?.[0];
    const coverImageFile = req.files['coverImage']?.[0];

    if (!musicFile) {
      return res.status(400).json({ message: "Music file is required" });
    }

    const musicKey = await uploadSong(musicFile.buffer, `${uuid()}`, 'music');
    let coverImageKey = null;
    if (coverImageFile) {
      coverImageKey = await uploadSong(coverImageFile.buffer, `${uuid()}`, 'coverImage');
    }

    const musicDetail = await musicModel.create({
      title: req.body.title,
      artist: req.user.fullName.firstName + " " + req.user.fullName.lastName,
      artistId: req.user.id,
      musicKey: musicKey.url,
      coverImageKey: coverImageKey?.url,
      uploadAt:new Date()
    });

    res.status(201).json({
      message: "Song uploaded successfully",
      musicDetail,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getArtistMusics(req, res) {
  const musicDocs = await musicModel.find({ artistId: req.user.id })

  const musics = []

  for (let music of musicDocs) {
    musics.push({
      id: music._id,
      artist: music.artist,
      title: music.title,
      musicUrl: music.musicKey,
      coverImageUrl: music.coverImageKey,
      uploadedAt:new Date()
      
    })
  }

  res.status(200).json({
    message: "Fetch successfully Artist",
    musics
  })
}

async function createPlaylist(req, res) {
  const { title, musics } = req.body

  try {
    const playlist = await playlistModel.create({
      artist: req.user.fullName.firstName + " " + req.user.fullName.lastName,
      artistId: req.user.id,
      title,
      userId: req.user.id,
      musics,
      uploadAt:new Date()
    })

    return res.status(201).json({
      message: "Playlist created Successfully",
      playlist
    })

  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message
    })
  }
}

async function getPlaylist(req, res) {
  try {
    const playlist = await playlistModel.find({ artistId: req.user.id }).populate('musics')

    return res.status(200).json({
      playlist
    })

  } catch (error) {
    console.log(error.message);

    return res.status(400).json({
      error: error.message
    })
  }
}

async function getAllMusic(req, res) {
  const { skip = 0} = req.query

  try {
    const musicDocs = await musicModel.find().skip(Number(skip)).lean()

    const musics = []
    for (let music of musicDocs) {
      musics.push({
        _id: music._id,
        title: music.title,
        artist: music.artist,
        musicUrl: music.musicKey,
        coverImageUrl: music.coverImageKey,
        uploadAt:new Date()
      })
    }

    res.status(200).json({
      message: "Fetch Successfully",
      musics
    })

  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      error: error.message
    })
  }
}

async function getAllPlaylist(req,res) {

  try {

    const playlist = await playlistModel.find()

    return res.status(200).json({
      message:"Fatch successfully",
      playlist,
      uploadAt:new Date()
    })


  } catch (error) {

    res.status(401).json({
      message:error.message
    })
    
  }
  
}

async function getPlaylistByid(req, res) {
  const { id } = req.params

  try {
    const playlistDocs = await playlistModel.findById(id)

    if (!playlistDocs) {
      return res.status(400).json({
        message: "Playlist not found"
      })
    }

    const musics = []

    for (let musicId of playlistDocs.musics) {
      const music = await musicModel.findById(musicId)
      if (music) {
        musics.push({
          musicUrl: music.musicKey,
          coverImageUrl: music.coverImageKey
        })
      }
    }

    playlistDocs.musics = musics

    return res.status(200).json({
      playlist: playlistDocs
    })

  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: error.message
    })
  }
}

async function getMusicByid(req, res) {
  const id = req.params.id

  try {
    const music = await musicModel.findById(id)

    if (!music) {
      return res.status(401).json({
        message: "Music Not found"
      })
    }

    return res.status(200).json({
      music,
      uploadAt:new Date()
    })

  } catch (error) {
    return res.status(401).json({
      message: error.message
    })
  }
}

async function getPlaylistbyArtist(req, res) {
  try {
    const playlists = await playlistModel.find({ artistId: req.user.id }).populate({ path: 'musics', model: 'music', select: 'title artist coverImageKey musicKey' })

    return res.status(200).json({
      message: "fatch successfully",
      playlists
    })

  } catch (error) {
    console.log(error.message);

    return res.status(401).json({
      message: error.message
    })
  }
}

module.exports = {
  MusicController,
  getArtistMusics,
  createPlaylist,
  getPlaylist,
  getAllMusic,
  getPlaylistByid,
  getMusicByid,
  getPlaylistbyArtist,
  getAllPlaylist
}
