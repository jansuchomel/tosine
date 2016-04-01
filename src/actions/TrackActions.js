export function songChanged(params) {
    return { type: "SONG_CHANGED", title: params.title,
        album: params.album, artists: params.artists, duration: params.duration };
}
