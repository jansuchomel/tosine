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
        else if ("result" in data) { // got a response for a request
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
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_state"}');
        this.requests[this.lastId] = "core.playback.get_state";

        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_current_track"}');
        this.requests[this.lastId] = "core.playback.get_current_track";

        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_time_position"}');
        this.requests[this.lastId] = "core.playback.get_time_position";

        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.tracklist.get_tl_tracks"}');
        this.requests[this.lastId] = "core.tracklist.get_tl_tracks";

        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.tracklist.index"}');
        this.requests[this.lastId] = "core.tracklist.index";

        setInterval(() => {
            this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_time_position"}');
            this.requests[this.lastId] = "core.playback.get_time_position";
        }, 2000);
    }
    resume() {
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.resume"}');
    }
    pause() {
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.pause"}');
    }
    previous() {
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.previous"}');
    }
    next() {
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.next"}');
    }
    select(index=0) {
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.play", "params": {"tlid":' + index +' }}');
    }
    removeFromTracklist(tracks=[]) {
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.tracklist.remove", "params": {"tlid":[' + tracks +'] }}');
    }
    _handleEvent(data) {
        // has the time position changed?
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_time_position"}');
        this.requests[this.lastId] = "core.playback.get_time_position";

        let params = {};
        if (data.event == 'track_playback_started') {
            // we need to get the track position in tracklist separately
            this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.tracklist.index"}');
            this.requests[this.lastId] = "core.tracklist.index";

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
            this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.tracklist.get_tl_tracks"}');
            this.requests[this.lastId] = "core.tracklist.get_tl_tracks";
        }
        if (data.event in this.events) this.events[data.event](params);
    }
    _handleResponse(id, response) {
        let params = {};
        if (this.requests[id] == 'core.playback.get_state') {
            params['state'] = response
        }
        else if (response && this.requests[id] == "core.playback.get_current_track") {
            params['title'] = response.name;
            params['album'] = response.album;
            params['artists'] = response.artists;
            params['duration'] = response.length;

        }
        else if (this.requests[id] == "core.playback.get_time_position") {
            params['position'] = response;
        }
        else if (this.requests[id] == "core.tracklist.get_tl_tracks") {
            params['tracks'] = response;
        }
        else if (this.requests[id] == "core.tracklist.index") {
            params['index'] = response;
        }
        if (this.requests[id] in this.methods) {
            this.methods[this.requests[id]](params);
            delete this.requests[id];
        }
    }
}
