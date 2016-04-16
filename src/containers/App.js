import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import { MopidyPlayer } from '../api/mopidy';

import Player from '../components/Player';
import Tracklist from '../components/Tracklist';
import Library from '../components/Library';

import { songChanged } from '../actions/TrackActions';
import { stateChanged, positionChanged } from '../actions/PlayerActions';
import { trackListChanged, indexChanged } from '../actions/TracklistActions'
import { librariesGot, libraryExpanded, artistExpanded, albumExpanded, trackExpanded } from '../actions/LibraryActions'

import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Navbar from 'react-bootstrap/lib/Navbar';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';



class App extends Component {
    constructor(props) {
        super(props);
        this.mopidy = new MopidyPlayer();
    }
    componentDidMount() {
        this.mopidy.registerEvent("track_playback_started", this.props.songChanged);
        this.mopidy.registerMethod("core.playback.get_current_track", this.props.songChanged);
        this.mopidy.registerEvent("playback_state_changed", this.props.stateChanged);
        this.mopidy.registerMethod("core.playback.get_state", this.props.stateChanged);
        this.mopidy.registerEvent("seeked", this.props.positionChanged);
        this.mopidy.registerMethod("core.playback.get_time_position", this.props.positionChanged);
        this.mopidy.registerEvent("tracklist_changed", () => {});
        this.mopidy.registerMethod("core.tracklist.get_tl_tracks", this.props.trackListChanged);
        this.mopidy.registerMethod("core.tracklist.index", this.props.indexChanged)
        this.mopidy.registerMethod("core.library.browse", params => {
            if (params["type"] == 'library') this.props.librariesGot({libraries: params.libraries});
            else if (params["type"] == 'artists') this.props.libraryExpanded({library: params.library, artists: params.artists});
            else if (params.type == 'albums') this.props.artistExpanded({library: params.library, artist: params.artist, albums: params.albums});
            else if (params.type == 'tracks') this.props.albumExpanded({
                library: params.library,
                artist: params.artist,
                album: params.album,
                tracks: params.tracks,
                callback: local_params => {
                    this.mopidy.expandTrack(local_params.library, local_params.artist, local_params.album, local_params.track, local_params.uri);
                }
            });
        });
        this.mopidy.registerMethod("core.library.lookup", this.props.trackExpanded)
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
            case "remove":
                if ("tracks" in params) this.mopidy.removeFromTracklist(params.tracks);
                break;
            case "expandLibrary":
                this.mopidy.expandLibrary(params.library, params.uri);
                break;
            case "expandArtist":
                this.mopidy.expandArtist(params.library, params.artist, params.uri);
                break;
            case "expandAlbum":
                this.mopidy.expandAlbum(params.library, params.artist, params.album, params.uri);
                break;
        }
    }
    render() {
        const { track, state, position, tracks, index, library } = this.props;

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
                            <Library libraries={library} mopidyAction={ this.mopidyAction.bind(this) } />
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
        index: state.tracklist.index,
        library: state.library
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
    return {
        songChanged: (track) => dispatch(songChanged(track)),
        stateChanged: (state) => dispatch(stateChanged(state)),
        positionChanged: (position) => dispatch(positionChanged(position)),
        trackListChanged: (trackList) => dispatch(trackListChanged(trackList)),
        indexChanged: (index) => dispatch(indexChanged(index)),
        libraryExpanded: (artists) => dispatch(libraryExpanded(artists)),
        artistExpanded: (artist) => dispatch(artistExpanded(artist)),
        albumExpanded: (album) => dispatch(albumExpanded(album)),
        trackExpanded: (album) => dispatch(trackExpanded(album)),
        librariesGot: (library) => dispatch(librariesGot(library))
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
