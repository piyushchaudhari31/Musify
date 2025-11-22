const mongoose = require('mongoose')

const playlistSchma = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    artistId:{
        type:mongoose.Schema.Types.ObjectId
    },
    musics:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:'music'
        }
    ]
},{
    timestamps:true
}
)

const playlistModel = mongoose.model("playlist",playlistSchma)

module.exports = playlistModel