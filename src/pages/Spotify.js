import React, { Fragment, useState, useEffect } from "react";
import { Col, Collapse, Container, Row } from "reactstrap"
import axios from "axios";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SPOTIFY_TOKEN_URL, SPOTIFY_URLS, PLAYLIST_TYPES } from "../utils/constants";
import { getSpotifyUrl } from "../utils/spotifyUrlFunctions";

const {
  REACT_APP_SPOTIFY_CLIENT_ID,
  REACT_APP_SPOTIFY_CLIENT_SECRET,
  REACT_APP_SPOTIFY_USERID 
} = process.env;


const getSpotifyGetWithTokenJson = (url, bearerToken) => {
  return {
    method: "get",
    url: url,
    headers: {
      "Authorization": "Bearer " + bearerToken
    },
  };
};

const spotifyGetJson = (url, bearerToken) => {
  return {
    method: "get",
    url: url,
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

const Spotify = () => {
  const [playlistList, setPlaylistList] = useState();
  const [playlistSongsArray, setplaylistSongsArray] = useState();
  const [whatIsNotCollapsed, setWhatIsNotCollapsed] = useState(0);

  useEffect(() => {
    getSpotify(); 
  }, []);

  const getTokenFromSpotifyAPI = () => {
    let bearerToken = localStorage.getItem("bearerToken");
    let tokenReceivedAt = parseInt(localStorage.getItem("tokenReceivedAt"));
    let expired = (tokenReceivedAt + 3600000) < Date.now();

    if (bearerToken && !expired) {
      console.log("we got the bearer token out of local storage! go us!");
      return Promise.resolve(localStorage.getItem("bearerToken"));
    }
    else {
      console.log("we had to go get the bearer token, sad face");
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
    // something is triggering this more than once, guarantee we don't hit spotify again
    if (playlistList) {
      return;
    }
    getTokenFromSpotifyAPI()
      .then(bearerToken => {
        axios(getSpotifyGetWithTokenJson(SPOTIFY_URLS.getPlaylistsByUser, bearerToken))
          .then(response => {
            setPlaylistList(_.sortBy(response.data.items, 'name'));
          })
          .catch(e => {
            console.log("failed in getSpotify function");
            let logMessage = e.response?.statusText ? e.response.statusText : e;
            console.log(logMessage);
          });
      }) 
      .catch(e => {
        console.log("failed in getSpotify function");
        let logMessage = e.response?.statusText ? e.response.statusText : e;
        console.log(logMessage);
      });
  }

  const getPlaylist = (playlistId, arrayId) => {
    if (playlistSongsArray?.[arrayId]) {
      // already in the array, no need to api it again
      // must refresh the page to reget (regret?) the playlist info
      return playlistSongsArray[arrayId];
    }

    let axiosUrl = getSpotifyUrl(PLAYLIST_TYPES.PLAYLIST_BY_ID, playlistId);

    getTokenFromSpotifyAPI()
      .then(bearerToken => {
        axios(spotifyGetJson(axiosUrl, bearerToken))
          .then(response => {
            let newArray = [];
            newArray[arrayId] = response.data.tracks.items;
            setplaylistSongsArray(newArray);
          })
          .catch(e => {
            console.log("failed in getPlaylist function");
            console.log(e.response?.statusText ? e.response.statusText : e);
          });
      })
      .catch(e => {
        console.log("failed in getPlaylist function");
        console.log(e.response?.statusText ? e.response.statusText : e);
      });
  }

  const togglePlaylistCollapse = (playlistId, arrayId) => {
    if (arrayId !== whatIsNotCollapsed)
    {
      // we are opening a new collapse, get the data for it
      getPlaylist(playlistId, arrayId);
      setWhatIsNotCollapsed(arrayId);
    }
    else {
      // uncollapse it. noncollapse. collapseless. decollapse. incollapse.
      // please reverse my earlier collapse decision
      setWhatIsNotCollapsed(0);
    }
  }

  return (
    <Container className="m-1 pt-3">
      <Row style={{fontWeight: "bold"}}>
        <Col>Name of Playlist</Col>
        <Col>Total Number of Songs</Col>
        <Col>Gooooooooo</Col>
      </Row>
      {_.map(playlistList, (p, i) => {
        return (
          <Fragment key={i}>
            <Row>
              <Col onClick={() => togglePlaylistCollapse(p.id, i)}>{p.name}</Col>
              <Col>{p.tracks.total}</Col>
              <Col>
                <a href={p.external_urls.spotify}>
                  <FontAwesomeIcon icon="link" />
                </a>
              </Col>
            </Row>
            <Collapse isOpen={i === whatIsNotCollapsed}>
              <Row className="pl-1">
                <Col>
                  {playlistSongsArray && _.map(playlistSongsArray[i], (s) => {
                    return(
                      <p>
                        <iframe key={s?.track?.id}
                          title={s?.track?.id}
                          src={`https://open.spotify.com/embed/track/${s?.track?.id}`}
                          width="300" 
                          height="80" 
                          frameBorder="0" 
                          allowtransparency="true" 
                          allow="encrypted-media"
                        ></iframe>
                      </p>
                    )}
                  )}
                </Col>
              </Row>
            </Collapse>
          </Fragment>
        )
      })}
    </Container>
  )
}

export default Spotify;