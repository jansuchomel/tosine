import React, { Component } from 'react';
import { render } from 'react-dom';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

export default class Tracklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: new Set(),
            lastSelected: -1,
            activeKeyModifiers: new Set
        };
    }
    playIndex(index) {
        this.props.mopidyAction("select", {index: index});
    }
    select(index) {
        if (this.state.activeKeyModifiers.has("Shift")) {
            let min = this.state.lastSelected > index ? index : this.state.lastSelected;
            let max = this.state.lastSelected < index ? index : this.state.lastSelected;
            let selectedSet = this.state.selectedItems;
            for (let i = min; i <= max; i++) {
                selectedSet.add(i);
            }
            this.setState({
                selectedItems: selectedSet
            });
        }
        else if (this.state.activeKeyModifiers.has("Control")) {
            let selectedSet = this.state.selectedItems;
            if (!this.state.selectedItems.has(index)) {
                selectedSet.add(index);
            }
            else {
                selectedSet.delete(index);
            }
            this.setState({
                selectedItems: selectedSet
            });
        }
        else {
            this.setState({
                selectedItems: (new Set()).add(index)
            });
        }
        this.setState({
            lastSelected: index
        });
    }
    handleKeyPress(event) {
        let key = event.key;
    }
    handleKeyDown(event) {
        let keySet = this.state.activeKeyModifiers;
        keySet.add(event.key);
        this.setState({
            activeKeyModifiers: keySet
        });
    }
    handleKeyUp(event) {
        let keySet = this.state.activeKeyModifiers;
        keySet.delete(event.key);
        this.setState({
            activeKeyModifiers: keySet
        });
        if (event.key == 'Delete') {
            console.log("deleting");
        }
    }
    render() {
        const { tracks, index, mopidyAction } = this.props;

        let tracksComps = [];
        if (tracks != undefined) {
            tracks.forEach(function (track, i) {
                if ("track" in track) {
                    let bsStyle = null;
                    if (i == index) bsStyle = "success";
                    else if (this.state.selectedItems.has(i)) {
                        bsStyle = "info";
                    }
                    tracksComps.push(
                      <ListGroupItem
                        key={"track_" + track.tlid}
                        onClick={this.select.bind(this, i)}
                        onDoubleClick={this.playIndex.bind(this, track.tlid)}
                        bsStyle={bsStyle}>
                        <b>{track.track.artists[0].name}</b> {track.track.name}
                        </ListGroupItem>
                    );
                }
          }.bind(this));
        }

        return (
        <ListGroup
            onKeyPress={this.handleKeyPress.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            onKeyUp={this.handleKeyUp.bind(this)}>
            { tracksComps }
            <ListGroupItem>
              </ListGroupItem>
        </ListGroup>);
    }
}
