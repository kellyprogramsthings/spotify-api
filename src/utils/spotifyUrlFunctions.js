import { PLAYLIST_TYPES } from "./constants"

export const getSpotifyUrl = (type, id) => {
  switch (type) {
    case PLAYLIST_TYPES.PLAYLISTS_BY_USER:
      return `https://api.spotify.com/v1/users/${id}/playlists`
    case PLAYLIST_TYPES.PLAYLIST_BY_ID:
      return `https://api.spotify.com/v1/playlists/${id}`
    default:
      return "you broke it"; // technical term
  }
};