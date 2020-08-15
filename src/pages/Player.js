import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { Grid, Image, Search, List, Button, Segment, Item, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import SpotifyPlayer from 'react-spotify-web-playback'
import { Search as SpotifySearch, SpotifyApiContext } from 'react-spotify-api'
import '../styles/Player.css'
import 'semantic-ui-css/semantic.min.css'

const Player = () => {

  const [spotifyAuthToken, setSpotifyAuthToken] = useState()

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get('spotifyAuthToken'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('spotifyAuthToken')])

  // Default search
  const [searchTrack, setSearchTrack] = useState('freedom')

  // Have a default track running for example
  const [currentTrack, setCurrentTrack] = useState({
    'name': "Freedom",
    'artists': [
      {'name': "Kygo", 'uri': "spotify:artist:23fqKkggKUBHNkbKtXEls4"},
      {'name': "Zak Abel", 'uri': "spotify:artist:6Gk5hoM7eW8NSCYhICMDHw"},
    ],
    'uri': "spotify:track:5Gj1wG8b12VQdEd3hUuSwo",
    'duration_ms': 198635,
    'explicit': false,
    'album': {
      'images': [
        {'url': "https://i.scdn.co/image/ab67616d0000b27380368f0aa8f90c51674f9dd2"},
        {'url': "https://i.scdn.co/image/ab67616d00001e0280368f0aa8f90c51674f9dd2"},
        {'url': "https://i.scdn.co/image/ab67616d0000485180368f0aa8f90c51674f9dd2"},
      ],
      'name': "Golden Hour",
      'uri': "spotify:album:7tcs1X9pzFvcLOPuhCstQJ"
    }
  })

  const [currentURI, setCurrentURI] = useState("spotify:track:5Gj1wG8b12VQdEd3hUuSwo")

  function handleTrackClick(track) {
    setCurrentTrack(track)
    setCurrentURI(track.album.uri)
  }

  return (
    <div className="player">
      <Segment inverted>
        <Grid columns={2} relaxed='very'>
          <Grid.Column>
            {/* <Button onClick={() => console.log(currentURI)}>click me</Button> */}
            <Grid columns={2} relaxed='very'>
              <Grid.Column width={6}>
                <h2>Search for a song</h2>
                <Search
                  onSearchChange={(e, data) => setSearchTrack(data.value ? data.value : 'kygo')}
                  showNoResults={false}
                />
              </Grid.Column>
              <Grid.Column width={10}>
              </Grid.Column>
            </Grid>
            <SpotifyApiContext.Provider value={spotifyAuthToken}>
              <SpotifySearch query={searchTrack} track >
                {(res) =>
                  searchTrack && res && res.data && res.data.tracks.items.length ?
                  <List inverted link animated>
                    {res.data.tracks.items.map(track => (
                      <List.Item onClick={() => handleTrackClick(track)} active={false} as='a'>
                        {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                      </List.Item>
                    ))}
                  </List> : <div>{`Oops, there doesn\'t appear to be any track called "${searchTrack}".`}</div>
                }
              </SpotifySearch>
            </SpotifyApiContext.Provider>
          </Grid.Column>
          <Grid.Column>
            <h1>Now Playing!</h1>
            <Item>
              <Item.Image width={128} height={128} src={currentTrack.album.images[1].url} />
              
              <Item.Content>
                <Item.Header as='a'>{currentTrack.name}</Item.Header>
                <Item.Meta>{currentTrack.artists.map(artist => artist.name).join(', ')}</Item.Meta>
                <Item.Description>Album: {currentTrack.album.name}</Item.Description>
                <Item.Extra>
                  <Label>Explicit</Label>
                </Item.Extra>
              </Item.Content>
            </Item>
          </Grid.Column>
        </Grid>
      </Segment>
      <div className="spotifyPlayer">
        <SpotifyPlayer
          autoPlay
          token={spotifyAuthToken}
          showSaveIcon={true}
          uris={[currentURI]}
          styles={{
            sliderColor: "#1cb954",
          }}
        />
      </div>
    </div>
  );
}

export default Player;
