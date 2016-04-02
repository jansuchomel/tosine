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
        console.log(data.event);
        if (data.event in this.events) { // got an event
            let params = {};
            if (data.event == 'track_playback_started') {
                params['title'] = data.tl_track.track.name;
                params['album'] = data.tl_track.track.album;
                params['artists'] = data.tl_track.track.artists;
                params['duration'] = data.tl_track.track.length;
            }
            else if (data.event == 'playback_state_changed') {
                params['state'] = data.new_state
            }
            this.events[data.event](params);
        }
        else if ("result" in data) { // got a response for a request
            let params = {};
            if (this.requests[data.id] == 'core.playback.get_state') {
                params['state'] = data.result
            }
            else if (this.requests[data.id] == "core.playback.get_current_track") {
                params['title'] = data.result.name;
                params['album'] = data.result.album;
                params['artists'] = data.result.artists;
                params['duration'] = data.result.length;

            }
            if (this.requests[data.id] in this.methods) {
              this.methods[this.requests[data.id]](params);
              delete this.methods[this.requests[data.id]];
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
