import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap"
import axios from "axios";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// aLi HaTeS dEsTrUcTuRiNg
const {
  REACT_APP_JSONBIN_API_KEY, 
  REACT_APP_SPOTIFY_CLIENT_ID,
  REACT_APP_SPOTIFY_CLIENT_SECRET,
  REACT_APP_SPOTIFY_USERID
 } = process.env;

// TODO: clean all this stuff that got dumped here up (dumped here up... good times. dangling)
const playlisturl = `https://api.spotify.com/v1/users/${REACT_APP_SPOTIFY_USERID}/playlists`;
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const SPOTIFY_URLS = {
  getPlaylistsByUser: playlisturl
  //getPlaylistsByUser: `https://api.spotify.com/v1/users/${REACT_APP_SPOTIFY_USERID}/playlists`
};

const getSpotifyGetWithTokenJson = (typeUrl, bearerToken) => {
  return {
    method: "get",
    url: typeUrl,
    headers: {
      "Authorization": "Bearer " + bearerToken
    },
  };
};

const SPOTIFY_DATA = 'grant_type=client_credentials';

const SPOTIFY_HEADERS = {
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  auth: {
    username: REACT_APP_SPOTIFY_CLIENT_ID,
    password: REACT_APP_SPOTIFY_CLIENT_SECRET
  }
};

const JSONBIN_JSON = {
  method: "get",
  url: "https://api.jsonbin.io/b/610ebdf4d5667e403a3b1679",
  headers: {
    "secret-key": REACT_APP_JSONBIN_API_KEY
  }
};

const Spotify = () => {
  const [playlists, setPlaylists] = useState();

  useEffect(() => { getSpotifyFromJsonbin(); }, []);

  const getSpotifyFromJsonbin = () => {
    axios(JSONBIN_JSON)
      .then(response => {
        setPlaylists(_.sortBy(response.data.items, 'name'));
      })
      .catch(e => {
        console.log("failed on get")
        let logMessage = e.response?.statusText ? e.response.statusText : e
        console.log(logMessage);
      });
  };

  const getTokenFromSpotifyAPI = () => {
    let bearerToken = localStorage.getItem("bearerToken");
    let tokenReceivedAt = parseInt(localStorage.getItem("tokenReceivedAt"));
    let expired = (tokenReceivedAt + 3600000) < Date.now();

    if (bearerToken && !expired) {
      return Promise.resolve(localStorage.getItem("bearerToken"));
    }
    else {
      return axios.post(SPOTIFY_TOKEN_URL, SPOTIFY_DATA, SPOTIFY_HEADERS)
        .then(token => {
          let bearerToken = token.data.access_token;
          localStorage.setItem("bearerToken", bearerToken);
          localStorage.setItem("tokenReceivedAt", Date.now());
          return bearerToken;
        })
        .catch(e => {
          console.log("failed in getTokenFromSpotifyAPI function");
          let logMessage = e.response?.statusText ? e.response.statusText : e;
          console.log(logMessage);
          // pass it on up
          return Promise.reject(e);
        });
    }
  }

  const getSpotify = () => {
    getTokenFromSpotifyAPI().then(bearerToken => {
      axios(getSpotifyGetWithTokenJson(SPOTIFY_URLS.getPlaylistsByUser, bearerToken))
        .then(response => {
          setPlaylists(_.sortBy(response.data.items, 'name'));
        })
        .catch(e => {
          console.log("failed in getSpotify function");
          let logMessage = e.response?.statusText ? e.response.statusText : e;
          console.log(logMessage);
        });
    });
  }

  return (
    <Container className="m-1 pt-3">
      <Row>
        <Col>
          <h5>We're just going to grab one playlist as an example</h5>
        </Col>
      </Row>
      <Row style={{fontWeight: "bold"}}>
        <Col>Name of Playlist</Col>
        <Col>Total Number of Songs</Col>
        <Col>Gooooooooo</Col>
      </Row>
      {_.map(playlists, (p, i) => {
        return (
          <Row key={i}>
            <Col>{p.name}</Col>
            <Col>{p.tracks.total}</Col>
            <Col><a href={p.external_urls.spotify}><FontAwesomeIcon icon="link" /></a></Col>
          </Row>
        )
      })}
      <Row>
        <Col>
          {/* <iframe 
            src="https://open.spotify.com/embed/track/7sgGULtAhIts3SeZdou7py" 
            width="300" 
            height="80" 
            frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media"
          ></iframe> */}
        </Col>
      </Row>
    </Container>
  )
}

export default Spotify;