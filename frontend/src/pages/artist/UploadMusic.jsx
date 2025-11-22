import React, { useState, useEffect, useRef } from 'react'
import '../artist/uploadmusic.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function UploadMusic() {

    const navigate = useNavigate();

    const [ form, setForm ] = useState({
        title: '',
        coverImage: null,
        music: null,
    })

    const [ coverPreview, setCoverPreview ] = useState(null) // object URL
    const [ musicPreview, setMusicPreview ] = useState(null) // object URL
    const [ musicDuration, setMusicDuration ] = useState(null)
    const audioRef = useRef(null)

    const url = "https://musify-mxwi.onrender.com"

    useEffect(() => {
        if (form.coverImage) {
            const url = URL.createObjectURL(form.coverImage)
            setCoverPreview(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setCoverPreview(null)
        }
    }, [ form.coverImage ])

    useEffect(() => {
        if (form.music) {
            const url = URL.createObjectURL(form.music)
            setMusicPreview(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setMusicPreview(null)
            setMusicDuration(null)
        }
    }, [ form.music ])

    // Extract audio duration when metadata loads
    function handleAudioLoaded() {
        if (audioRef.current?.duration) {
            const d = audioRef.current.duration
            const mins = Math.floor(d / 60)
            const secs = Math.round(d % 60).toString().padStart(2, '0')
            setMusicDuration(`${mins}:${secs}`)
        }
    }

    function handleChange(e) {
        const { name, files, value, type } = e.target
        setForm(f => ({ ...f, [ name ]: type === 'file' ? (files?.[ 0 ] || null) : value }))
    }

    function removeFile(kind) {
        setForm(f => ({ ...f, [ kind ]: null }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', form.title)
        if (form.coverImage) {
            formData.append('coverImage', form.coverImage)
        }
        if (form.music) {
            formData.append('music', form.music)
        }

        axios.post(`${url}/api/music/songs`, formData, {
            withCredentials: true,
        })
            .then(() => {
                navigate('/artist/dashboard');
                toast.success("Song Uploaded successfully")
                
             })

        // UI only – integrate API/upload logic later.
    }

    return (
        <div className="upload-music-page stack" style={{ gap: 'var(--space-6)' }}>
            <header className="upload-header">
                <h1 className="upload-title">Upload Music</h1>
                <p className="text-muted upload-sub">Add a new track to your catalog</p>
            </header>

            <form className="upload-form surface" onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <div className="field-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="Song title"
                        />
                    </div>

                    <div className="field-group file-field">
                        <label htmlFor="coverImage">Cover Image</label>
                        <div className="file-input-wrapper">
                            <input
                                id="coverImage"
                                name="coverImage"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <div className="file-meta text-muted">
                                {form.coverImage ? form.coverImage.name : 'Choose an image (JPEG/PNG)'}
                            </div>
                        </div>
                    </div>

                    <div className="field-group file-field">
                        <label htmlFor="music">Music File</label>
                        <div className="file-input-wrapper">
                            <input
                                id="music"
                                name="music"
                                type="file"
                                accept="audio/*"
                                onChange={handleChange}
                            />
                            <div className="file-meta text-muted">
                                {form.music ? form.music.name : 'Select audio file (MP3/WAV)'}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="actions">
                    <button type="submit" className="btn btn-primary">Upload</button>
                    <button type="reset" className="btn" onClick={() => setForm({ title: '', coverImage: null, music: null })}>Reset</button>
                </div>
            </form>
        </div>
    )
}
