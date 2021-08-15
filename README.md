Go to https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app and get the needed credentials. If the instructions are not clear, hit me up.

Once you have the credentials, 
1. make a new file called .env 
2. copy the contents of .env-example 
3. fill in the values with your info.

You do not need a jsonbin api key, that is only for testing. Just leave the key for that blank. jsonbin is awesome btw. Check it out.

TODO:
- clean up some sad code
- make the songlist have another collapse per song to stop hitting the api with 100 requests all at once
- use the "get next" thing to get all tracks for playlists that have more than 100 tracks
