import WebSocket from 'ws';

export class MopidyPlayer {
    constructor(wsUrl="ws://localhost:6680/mopidy/ws/") {
        this.ws = new WebSocket(wsUrl);
        this.events = {};
        this.methods = {};
        this.requests = {};
        this.lastId = 0;
        this.ws.on('message', this._receiveMessage.bind(this));
        this.ws.on('open', this._initialize.bind(this));
    }
    _receiveMessage(rawData) {
        let data = JSON.parse(rawData);
        if (data.event in this.events) { // got an event
            this._handleEvent(data);
        }
        else if ("result" in data && data.result != null) { // got a response for a request
            this._handleResponse(data.id, data.result);
        }
    }
    registerEvent(type, f) {
        this.events[type] = f;
    }
    registerMethod(type, f) {
        this.methods[type] = f;
    }
    _initialize() {
        this._sendRequest("core.playback.get_state");
        this._sendRequest("core.playback.get_current_track");
        this._sendRequest("core.playback.get_time_position");
        this._sendRequest("core.tracklist.get_tl_tracks");
        this._sendRequest("core.tracklist.index");

        this._sendRequest("core.library.browse", true, {}, "library_" + ++this.lastId);

        setInterval(() => {
            this._sendRequest("core.playback.get_time_position");
        }, 2000);
    }
    resume() {
        this._sendRequest("core.playback.resume", false);
    }
    pause() {
        this._sendRequest("core.playback.pause", false);
    }
    previous() {
        this._sendRequest("core.playback.previous", false);
    }
    next() {
        this._sendRequest("core.playback.next", false);
    }
    select(index=0) {
        this._sendRequest("core.playback.play", false, {tlid: index});
    }
    removeFromTracklist(tracks=[]) {
        this._sendRequest("core.tracklist.remove", false, {tlid: tracks});
    }
    addToTl(uri) {
        console.log(uri);
        this._sendRequest("core.tracklist.add", false, {uri: uri});
    }
    expandLibrary(library, uri) {
        this._sendRequest("core.library.browse", true, {uri: uri}, "artists_" + ++this.lastId, {library: library});
    }
    expandArtist(library, artist, uri) {
        this._sendRequest("core.library.browse", true, {uri: uri}, "albums_" + ++this.lastId,
            {library: library,artist: artist});
    }
    expandAlbum(library, artist, album, uri) {
        this._sendRequest("core.library.browse", true, {uri: uri}, "tracks_" + ++this.lastId,
            {library: library, artist:artist, album: album});
    }
    expandTrack(library, artist, album, track, uri) {
        this._sendRequest("core.library.lookup", true, {uri: uri}, "details_" + ++this.lastId,
            {library: library, artist:artist, album: album, track: track});
    }
    _handleEvent(data) {
        let params = {};
        if (data.event == 'track_playback_started') {
            // we need to get the track position in tracklist separately
            this._sendRequest("core.tracklist.index");

            params = {
              title: data.tl_track.track.name,
              album: data.tl_track.track.album,
              artists: data.tl_track.track.artists,
              duration: data.tl_track.track.length
            }
        }
        else if (data.event == 'playback_state_changed') {
            params = {state: data.new_state}
        }
        else if (data.event == 'seeked') {
            params = {position: data.time_position}
        }
        else if (data.event == 'tracklist_changed') {
            // we need to get the tracklist separately
            this._sendRequest("core.tracklist.get_tl_tracks");
        }

        if (data.event in this.events) this.events[data.event](params);
    }
    _handleResponse(id, response) {
        if (!(id in this.requests)) return;

        let params = {};
        let method = this.requests[id].method;

        // build perameters for the callback
        if (method == 'core.playback.get_state') params = {state: response};
        else if (method == "core.playback.get_current_track") {
            params = {
                title: response.name,
                album: response.album,
                artists: response.artists,
                duration: response.length
            }
        }
        else if (method == "core.playback.get_time_position") params = {position: response};
        else if (method == "core.tracklist.get_tl_tracks") params = {tracks: response};
        else if (method == "core.tracklist.index") params = {index: response};
        else if (method == "core.library.lookup") {
            params = {
                type: "details",
                details: response,
                library: this.requests[id].remember.library,
                artist: this.requests[id].remember.artist,
                album: this.requests[id].remember.album,
                track: this.requests[id].remember.track
            }
        }
        else if (method == "core.library.browse") {
            if (id.indexOf("library_") == 0) {
                let libraries = [];
                for (let library of response) {
                    switch (library.uri) {
                        case 'gmusic:directory':
                            library.uri = 'gmusic:artist';
                            // TODO: gmusic:artist sometimes returns tracks instead of albums
                        case 'local:directory':
                            libraries.push(library);
                            break;
                    }
                }
                params = {
                    type: "library",
                    libraries: libraries
                }
            }
            else if (id.indexOf("artists_") == 0) {
                params = {
                    type: "artists",
                    artists: response,
                    library: this.requests[id].remember.library
                }
            }
            else if (id.indexOf("albums_") == 0) {
                params = {
                    type: "albums",
                    library: this.requests[id].remember.library,
                    albums: response,
                    artist: this.requests[id].remember.artist
                }
            }
            else if (id.indexOf("tracks_") == 0) {
                params = {
                    type: "tracks",
                    tracks: response,
                    library: this.requests[id].remember.library,
                    artist: this.requests[id].remember.artist,
                    album: this.requests[id].remember.album
                }
            }
        }


        if (method in this.methods) {
            this.methods[this.requests[id].method](params);
            delete this.requests[id];
        }
    }

    _sendRequest(method, register=true, params={}, id=++this.lastId, remember={}) {
        if (method == "core.library.browse" && !("uri" in params)) params['uri'] = null; // the uri parameter needs to be set even if null
        this.ws.send('{"jsonrpc": "2.0", "id": "' + id +'", "method": "' + method +'", "params": '+JSON.stringify(params)+'}');
        if (register==true) this.requests[id] = { method: method, remember:remember };
    }
}
