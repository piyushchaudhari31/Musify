const express = require('express');
const { createPlaylist, getAllMusic, getArtistMusics, getMusicByid, getPlaylist, getPlaylistbyArtist, getPlaylistByid, MusicController, getAllPlaylist } = require('../controllers/music.controller.js');
const multer = require('multer');
const { authArtistMiddleware, authUserMiddleware } = require('../middleware/music.middleware.js');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', authUserMiddleware,getAllMusic);

router.post('/songs', authArtistMiddleware, upload.fields(
    [
        { name: 'music', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]
), MusicController);

router.get('/get-detail/:id', authUserMiddleware, getMusicByid);
router.get('/artist-music', authArtistMiddleware, getArtistMusics);

router.post('/playlist', authArtistMiddleware, createPlaylist);
router.get('/playlist',authUserMiddleware,getAllPlaylist)

router.get('/playlist', authUserMiddleware, getPlaylist);
router.get('/playlist/artist', authUserMiddleware, getPlaylistbyArtist);
router.get('/playlist/:id', authUserMiddleware, getPlaylistByid);

module.exports = router;
