import WebSocket from 'ws';

export class MopidyPlayer {
    constructor(wsUrl="ws://localhost:6680/mopidy/ws/") {
        this.ws = new WebSocket(wsUrl);
        this.events = {};
        this.methods = {};
        this.requests = {};
        this.lastId = 0;
        this.ws.on('message', this.receiveMessage.bind(this));
        this.ws.on('open', this.initialize.bind(this));
    }
    receiveMessage(rawData) {
        let data = JSON.parse(rawData);
        if (data.event == 'tracklist_changed') {
            this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.tracklist.get_tracks"}');
            this.requests[this.lastId] = "core.tracklist.get_tracks";
        }
        if (data.event in this.events) { // got an event
            // has the time position changed?
            this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_time_position"}');
            this.requests[this.lastId] = "core.playback.get_time_position";
            let params = {};
            if (data.event == 'track_playback_started') {
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
            if (data.event in this.events) this.events[data.event](params);

            // Something may have changed, better check current track
            this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_current_track"}');
            this.requests[this.lastId] = "core.playback.get_current_track";


        }
        else if ("result" in data) { // got a response for a request
            let params = {};
            if ("result" in data &&  this.requests[data.id] == 'core.playback.get_state') {
                params['state'] = data.result
            }
            else if ("result" in data
            && data.result
            && data.result !== undefined
            && this.requests[data.id] == "core.playback.get_current_track") {
                params['title'] = data.result.name;
                params['album'] = data.result.album;
                params['artists'] = data.result.artists;
                params['duration'] = data.result.length;

            }
            else if ("result" in data && this.requests[data.id] == "core.playback.get_time_position") {
                params['position'] = data.result;
            }
            else if ("result" in data && this.requests[data.id] == "core.tracklist.get_tracks") {
                params['tracks'] = data.result;
            }
            else if ("result" in data && this.requests[data.id] == "core.tracklist.index") {
                params['index'] = data.result;
            }
            if (this.requests[data.id] in this.methods) {
                this.methods[this.requests[data.id]](params);
                delete this.requests[data.id];
            }
        }
    }
    registerEvent(type, f, params = {}) {
        this.events[type] = f;
    }
    registerMethod(type, f, params = {}) {
        this.methods[type] = f;
    }
    initialize() {
        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_state"}');
        this.requests[this.lastId] = "core.playback.get_state";

        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_current_track"}');
        this.requests[this.lastId] = "core.playback.get_current_track";

        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.playback.get_time_position"}');
        this.requests[this.lastId] = "core.playback.get_time_position";

        this.ws.send('{"jsonrpc": "2.0", "id": ' + ++this.lastId +', "method": "core.tracklist.get_tracks"}');
        this.requests[this.lastId] = "core.tracklist.get_tracks";

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
}
