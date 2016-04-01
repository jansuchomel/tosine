import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import { MopidyPlayer } from '../api/mopidy';

import Player from '../components/Player';
import { songChanged } from '../actions/TrackActions';
import { stateChanged } from '../actions/PlayerActions';

class App extends Component {
    constructor() {
        super();
        this.mopidy = new MopidyPlayer();
    }
    componentDidMount() {
        if ("songChanged" in this.props) {
            this.mopidy.registerEvent("track_playback_started", this.props.songChanged);
            this.mopidy.registerMethod("core.playback.get_current_track", this.props.songChanged);
        }
        if ("stateChanged" in this.props) {
            this.mopidy.registerEvent("playback_state_changed", this.props.stateChanged);
            this.mopidy.registerMethod("core.playback.get_state", this.props.stateChanged);

        }
        this.mopidy.initialize();
    }
    render() {
        const { track, state } = this.props;
        return (
            <Player track={track} state={state} />
        );
    }
}

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
    return {
        track: state.track,
        state: state.player.state
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
    return {
        songChanged: (track) => dispatch(songChanged(track)),
        stateChanged: (state) => dispatch(stateChanged(state))
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
