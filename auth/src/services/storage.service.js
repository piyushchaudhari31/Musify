const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.publicKey,
    privateKey: process.env.privateKey,
    urlEndpoint: process.env.urlEndpoint
});

async function uploadSong(file, filename, subfolder = "") {
    const response = await imagekit.upload({
        file: file,
        fileName: filename,
        folder: `Musify/${subfolder}`
    });
    return response;
}

module.exports = { uploadSong };
