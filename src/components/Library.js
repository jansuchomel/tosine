import React, { Component } from 'react';
import { render } from 'react-dom';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

export default class Library extends Component {
    render() {
        const { artists } = this.props;
        let artistsComps = [];
        artists.forEach((uris, artist) => {
            artistsComps.push(<p>{artist}</p>)
        });
        return (
        <div className="library">{artistsComps}</div>);
    }
}
