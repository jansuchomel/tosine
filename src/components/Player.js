import React, { Component } from 'react';
import { render } from 'react-dom';

export default class Player extends Component {
    render() {
        const { track, state, mopidyAction, position } = this.props;

        let artistComps = [];
        if (track.artists != undefined) {
          track.artists.forEach(function (artist, i) {
              artistComps.push(<b key={"artist_" + i}> {artist.name} </b>);
          });
        }

        return (
        <div>
            <b>{ track.title } </b>
            by { artistComps }
            from <b> { track.album.name }</b>
            <Control state={ state } mopidyAction={ mopidyAction } />
            <SeekBar duration={ track.duration } position={position} state={state} />
        </div>);
    }
}

class Control extends Component {
    resume() {
        this.props.mopidyAction("resume");
    }
    pause() {
        this.props.mopidyAction("pause");
    }
    previous() {
        this.props.mopidyAction("previous");
    }
    next() {
        this.props.mopidyAction("next");
    }
    render() {
        const { state, mopidyAction } = this.props;

        let playPause = <a onClick={ this.resume.bind(this) }> play </a>;
        if ( state == "playing" ) {
            playPause = <a onClick={ this.pause.bind(this) }> pause </a>;
        }
        else if ( state == "stopped" ) {
            playPause = <b>stopped</b>
        }

        return (
            <div>
                <a onClick={ this.previous.bind(this) }> prev </a>
                { playPause }
                <a onClick={ this.next.bind(this) }> next </a>
            </div>
        )
    }
}

class SeekBar extends Component {
    constructor(props) {
        super(props);
        this.state = {position: props.position};
    }
    componentDidMount() {
        setInterval(() => {
            this.tick();
        }, 100);
        this.setState({position: this.props.position});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({position: nextProps.position});
    }
    tick() {
        if (this.props.state == "playing") {
            this.setState({position: this.state.position + 100});
            this.state.step++;
        }
    }
    render() {
        const { duration } = this.props;
        if (this.state && "position" in this.state) {
            return <b>{ this.state.position / 1000}/{duration / 1000}</b>
        }
        else {
            return <b>ERROR</b>
        }
    }
}
