import WebSocket from 'ws';

export class MopidyPlayer {
    constructor(wsUrl="ws://localhost:6680/mopidy/ws/") {
        this.ws = new WebSocket(wsUrl);
        this.events = {};
        this.methods = {};
        this.requests = {};
        this.ws.on('message', this.receiveMessage.bind(this));
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
        console.log(data);
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
            if (this.requests[data.id] in this.methods) this.methods[this.requests[data.id]](params);
        }
    }
    registerEvent(type, f, params = {}) {
        this.events[type] = f;
    }
    registerMethod(type, f, params = {}) {
        this.methods[type] = f;
    }
    initialize() {
        this.ws.on('open', function open() {
            this.ws.send('{"jsonrpc": "2.0", "id": 1, "method": "core.playback.get_state"}');
            this.requests["1"] = "core.playback.get_state";
            this.ws.send('{"jsonrpc": "2.0", "id": 2, "method": "core.playback.get_current_track"}');
            this.requests["2"] = "core.playback.get_current_track";
        }.bind(this));
    }

}
