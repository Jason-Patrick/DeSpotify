const request = require('request');
const fs = require('fs');

var bearerToken = "[[[BEARER TOKEN HERE]]]"

var headers = {
    'Referer': 'https://developer.spotify.com/',
    'Authorization': 'Bearer ' + bearerToken,
    'Origin': 'https://developer.spotify.com',
};

var maxOffset = 800;
var savedSongs = [];
var currentOffset = 0;

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var songs = body.items.map(i => {
      song = i.track.name
      artists = i.track.artists.map(j => j.name)
      return {song: song, artists: artists}
    });
    savedSongs = savedSongs.concat(songs);
  }
  if (currentOffset >= maxOffset) {
    let songs = JSON.stringify(savedSongs);
    fs.writeFileSync('Songs.json', songs);
  }
}

for (; currentOffset <= maxOffset; currentOffset+=50) {
  var options = {
    url: 'https://api.spotify.com/v1/me/tracks?market=US&limit=50&offset='+currentOffset,
    headers: headers,
    json: true
  };
  request(options, callback);
}