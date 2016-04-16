export function librariesGot(params) {
    return { type: "LIBRARIES_GOT",  libraries: params.libraries }
}

export function libraryExpanded(params) {
    return { type: "LIBRARY_EXPANDED", library: params.library, artists: params.artists }
}

export function artistExpanded(params) {
    return { type: "ARTIST_EXPANDED", library: params.library, artist: params.artist, albums: params.albums }
}

export function albumExpanded(params) {
    for (let track of params.tracks) {
        params.callback({library: params.library, artist: params.artist, album: params.album,
            track: track.name, uri: track.uri});
    }
    return { type: "ALBUM_EXPANDED", library: params.library, artist: params.artist, album: params.album,
        tracks: params.tracks }
}

export function trackExpanded(params) {
    return { type: "TRACK_EXPANDED", library: params.library, artist: params.artist, album: params.album,
        track: params.track, details: params.details[0] }
}
