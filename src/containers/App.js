import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import { MopidyPlayer } from '../api/mopidy';

import Player from '../components/Player';
import Tracklist from '../components/Tracklist'

import { songChanged } from '../actions/TrackActions';
import { stateChanged, positionChanged } from '../actions/PlayerActions';
import { trackListChanged, indexChanged } from '../actions/TracklistActions'

import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Navbar from 'react-bootstrap/lib/Navbar';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';



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
        if ("positionChanged" in this.props) {
            this.mopidy.registerEvent("seeked", this.props.positionChanged);
            this.mopidy.registerMethod("core.playback.get_time_position", this.props.positionChanged);
        }
        if ("trackListChanged" in this.props) {
            this.mopidy.registerEvent("tracklist_changed", () => {});
            this.mopidy.registerMethod("core.tracklist.get_tl_tracks", this.props.trackListChanged);
        }
        if ("indexChanged" in this.props) {
            this.mopidy.registerMethod("core.tracklist.index", this.props.indexChanged)
        }
    }
    mopidyAction(action, params={}) {
        switch(action) {
            case "resume":
                this.mopidy.resume();
                break;
            case "pause":
                this.mopidy.pause();
                break;
            case "previous":
                this.mopidy.previous();
                break;
            case "next":
                this.mopidy.next();
                break;
            case "select":
                if ("index" in params) this.mopidy.select(params.index);
                break;
        }
    }
    render() {
        const { track, state, position, tracks, index } = this.props;
        return (
            <div>
                <Navbar fixedBottom={true}>
                    <Player track={track} state={state} mopidyAction={this.mopidyAction.bind(this)} position={position} />
                </Navbar>
                <Navbar staticTop={true}>
                    <Navbar.Header>
                      <Navbar.Brand>
                        <a href="#">tosine</a>
                      </Navbar.Brand>
                      <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                      <Navbar.Form pullLeft>
                        <Input type="text"  />
                        {' '}
                      </Navbar.Form>
                    </Navbar.Collapse>
                </Navbar>
                <Row className={"content"}>
                    <Col md={4}>
                        <Panel>
                          <b>TODO: library</b>
                        </Panel>
                    </Col>
                    <Col md={5}>
                        <Panel>
                            <Tracklist tracks={ tracks } index={ index } mopidyAction={ this.mopidyAction.bind(this)} />
                        </Panel>
                    </Col>
                    <Col md={3}>
                    <Panel>
                      <b>TODO: details</b>
                    </Panel>
                    </Col>
                </Row>
            </div>
        );
    }
}

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
    return {
        track: state.track,
        state: state.player.state,
        position: state.player.position,
        tracks: state.tracklist.tracks,
        index: state.tracklist.index
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
    return {
        songChanged: (track) => dispatch(songChanged(track)),
        stateChanged: (state) => dispatch(stateChanged(state)),
        positionChanged: (position) => dispatch(positionChanged(position)),
        trackListChanged: (trackList) => dispatch(trackListChanged(trackList)),
        indexChanged: (index) => dispatch(indexChanged(index))
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
