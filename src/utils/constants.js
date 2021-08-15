import { config } from "dotenv";

config({path: "../.env"})

// eye roll at myself, rename this to url_types
export const PLAYLIST_TYPES = {
  PLAYLISTS_BY_USER: 1,
  PLAYLIST_BY_ID: 2
}

export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_TOKEN_TIMEOUT = 3600;

// because it doesn't want to compile to test my new code
export const SPOTIFY_URLS = {
  getPlaylistsByUser: `https://api.spotify.com/v1/users/${process.env.REACT_APP_SPOTIFY_USERID}/playlists`
};

// export const JSONBIN_JSON = {
//   method: "get",
//   url: "",
//   headers: {
//     "secret-key": REACT_APP_JSONBIN_API_KEY
//   }
// };