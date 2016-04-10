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
    expandArtist(artist, uris=[]) {
        for (let uri of uris) {
            this._sendRequest("core.library.browse", true, {uri: uri}, "albums_" + ++this.lastId, {artist: artist});
        }
    }
    expandAlbum(artist, album, uris=[]) {
        for (let uri of uris) {
            this._sendRequest("core.library.browse", true, {uri: uri}, "tracks_" + ++this.lastId, {artist:artist, album: album});
        }
    }
    _handleEvent(data) {
        this._sendRequest("core.playback.get_time_position"); // has the time position changed?

        let params = {};
        if (data.event == 'track_playback_started') {
            // we need to get the track position in tracklist separately
            this._sendRequest("core.tracklist.index");

            params['title'] = data.tl_track.track.name;
            params['album'] = data.tl_track.track.album;
            params['artists'] = data.tl_track.track.artists;
            params['duration'] = data.tl_track.track.length;
        }
        else if (data.event == 'playback_state_changed') {
            params['state'] = data.new_state
        }
        else if (data.event == 'seeked') {
            params['position'] = data.time_position
        }
        else if (data.event == 'tracklist_changed') {
            this._sendRequest("core.tracklist.get_tl_tracks");
        }
        if (data.event in this.events) this.events[data.event](params);
    }
    _handleResponse(id, response) {
        if (id in this.requests) {
            let params = {};
            if (this.requests[id].method == 'core.playback.get_state') {
                params['state'] = response
            }
            else if (response && this.requests[id].method == "core.playback.get_current_track") {
                params['title'] = response.name;
                params['album'] = response.album;
                params['artists'] = response.artists;
                params['duration'] = response.length;
            }
            else if (this.requests[id].method == "core.playback.get_time_position") {
                params['position'] = response;
            }
            else if (this.requests[id].method == "core.tracklist.get_tl_tracks") {
                params['tracks'] = response;
            }
            else if (this.requests[id].method == "core.tracklist.index") {
                params['index'] = response;
            }
            else if (this.requests[id].method == "core.library.browse") {
                if (id.indexOf("library_") == 0) {
                    params.type = "library";
                    for (let library of response) {

                        if (library.uri == 'local:directory') {
                            this._sendRequest("core.library.browse", true, {uri: 'local:directory'}, "artists_" + ++this.lastId);
                        }
                        else if (library.uri == 'gmusic:directory') {
                            this._sendRequest("core.library.browse", true, {uri: 'gmusic:artist'}, "artists_" + ++this.lastId);
                        }
                        // else we don't know how to get artist list from the library

                        params.artists = [];
                    }
                }
                else if (id.indexOf("artists_") == 0) {
                    params.type = "artists";
                    params.artists = response;
                }
                else if (id.indexOf("albums_") == 0) {
                    params.type = "albums";
                    params.albums = response;
                    params.artist = this.requests[id].remember['artist'];
                }
                else if (id.indexOf("tracks_") == 0) {
                    params.type = "tracks";
                    params.tracks = response;
                    params.artist = this.requests[id].remember['artist'];
                    params.album = this.requests[id].remember['album'];
                }
            }
            if (this.requests[id].method in this.methods) {
                this.methods[this.requests[id].method](params);
                delete this.requests[id];
            }
        }
    }

    _sendRequest(method, register=true, params={}, id=++this.lastId, remember={}) {
        if (method == "core.library.browse" && !("uri" in params)) params['uri'] = null; // the uri parameter needs to be set even if null
        this.ws.send('{"jsonrpc": "2.0", "id": "' + id +'", "method": "' + method +'", "params": '+JSON.stringify(params)+'}');
        if (register==true) this.requests[id] = { method: method, remember:remember };
    }
}
