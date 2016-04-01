import WebSocket from 'ws';

export class MopidyPlayer {
    constructor(wsUrl="ws://localhost:6680/mopidy/ws/") {
        this.ws = new WebSocket(wsUrl);
        this.events = {};
        this.ws.on('message', this.receiveMessage.bind(this));
    }
    receiveMessage(rawData) {
        let data = JSON.parse(rawData);
        console.log(data.event);
        if (data.event in this.events) {
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
            this.events[data.event].func(params);
        }
    }
    registerEvent(type, f, params = {}) {
        this.events[type] = {func: f, params: params};
    }

}
