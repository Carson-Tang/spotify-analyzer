import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { Button, Segment, Grid, List } from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'
import '../styles/Discover.css'

const Discover = () => {

  const [spotifyAuthToken, setSpotifyAuthToken] = useState()

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get('spotifyAuthToken'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('spotifyAuthToken')])
  
  const [currentTrack, setCurrentTrack] = useState()
  const [recommendedTracks, setRecommendedTracks] = useState()

  const [acousticness, setAcousticness] = useState({low: 0, hi: 1})
  const [danceability, setDanceability] = useState({low: 0, hi: 1})
  const [energy, setEnergy] = useState({low: 0, hi: 1})
  const [instrumentalness, setInstrumentalness] = useState({low: 0, hi: 1})
  const [speechiness, setSpeechiness] = useState({low: 0, hi: 1})
  const [valence, setValence] = useState({low: 0, hi: 1})
  const [tempo, setTempo] = useState({low: 80, hi: 185})

  async function getRecommendations() {
    const params = `?seed_genres=classical
&min_acousticness=${acousticness.low}
&max_acousticness=${acousticness.hi}
&min_danceability=${danceability.low}
&max_danceability=${danceability.hi}
&min_energy=${energy.low}
&max_energy=${energy.hi}
&min_instrumentalness=${instrumentalness.low}
&max_instrumentalness=${instrumentalness.hi}
&min_speechiness=${speechiness.low}
&max_speechiness=${speechiness.hi}
&min_valence=${valence.low}
&max_valence=${valence.hi}
&min_tempo=${tempo.low}
&max_tempo=${tempo.hi}
`

    await fetch(`https://api.spotify.com/v1/recommendations` + params, {
      headers: {
        Authorization: `Bearer ${spotifyAuthToken}`,
      },
    }).then(
      function(res) {
        if(res.status !== 200) {
          console.log(`Invalid response ${res.status}`)
          return
        } 
        res.json().then(function(data) {
          console.log(data)
          setRecommendedTracks(data)
        })
      }
    );
  }

  function handleTrackClick(track) {
    setCurrentTrack(track)
  }

  return (
    <div className="discover">
      <Segment inverted>
        <div className='discover-sliders'>
          <Grid>
          <Grid.Column width={5}>
            <Grid.Row>
              <h1>Acousticness</h1>
              Music that solely or primarily uses instruments that produce sound through acoustic means, as opposed to electric or electronic means.
            </Grid.Row>
            <Grid.Row>
              <h1>Energy</h1>
              Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.
            </Grid.Row>
            <Grid.Row>
              <h1>Speechiness</h1>
              Speechiness detects the presence of spoken words in a track.
            </Grid.Row>
            <Grid.Row>
              <h1>Tempo</h1>
              The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={5}>
          Acousticness
          <Slider acousticness multiple
            style={{ trackFill: { backgroundColor: "#fa8223"}}}
            settings={{
              start: [0,1],
              min: 0,
              max: 1,
              step: 0.01,
              onChange: value => {
                setAcousticness({low: value[0], hi: value[1]});
              }
            }}
          />
          Danceability
          <Slider danceability multiple
            style={{ trackFill: { backgroundColor: "#fa8223"}}}
            settings={{
              start: [0,1],
              min: 0,
              max: 1,
              step: 0.01,
              onChange: value => {
                setDanceability({low: value[0], hi: value[1]});
              }
            }}
          />
          Energy
          <Slider energy multiple
            style={{ trackFill: { backgroundColor: "#fa8223"}}}
            settings={{
              start: [0,1],
              min: 0,
              max: 1,
              step: 0.01,
              onChange: value => {
                setEnergy({low: value[0], hi: value[1]});
              }
            }}
          />
          Instrumentalness
          <Slider instrumentalness multiple
            style={{ trackFill: { backgroundColor: "#fa8223"}}}
            settings={{
              start: [0,1],
              min: 0,
              max: 1,
              step: 0.01,
              onChange: value => {
                setInstrumentalness({low: value[0], hi: value[1]});
              }
            }}
          />
          Speechiness
          <Slider speechiness multiple
            style={{ trackFill: { backgroundColor: "#fa8223"}}}
            settings={{
              start: [0,1],
              min: 0,
              max: 1,
              step: 0.01,
              onChange: value => {
                setSpeechiness({low: value[0], hi: value[1]});
              }
            }}
          />
          Valence
          <Slider valence multiple
            style={{ trackFill: { backgroundColor: "#fa8223"}}}
            settings={{
              start: [0,1],
              min: 0,
              max: 1,
              step: 0.01,
              onChange: value => {
                setValence({low: value[0], hi: value[1]});
              }
            }}
          />
          Tempo: {tempo.low} BPM - {tempo.hi} BPM
          <Slider tempo multiple
            style={{ trackFill: { backgroundColor: "#fa8223"}}}
            settings={{
              start: [80,185],
              min: 80,
              max: 185,
              step: 1,
              onChange: value => {
                setTempo({low: value[0], hi: value[1]});
              }
            }}
          />
          <h2>Choose up to 5 genres</h2>
          <Button className='search-button' onClick={() => getRecommendations()}>Search</Button>
          </Grid.Column>
          <Grid.Column width={5}>
            <div className='right-param-text'>
            <Grid.Row>
              <h1>Danceability</h1>
              How suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.
            </Grid.Row>
            <Grid.Row>
              <h1>Instrumentalness</h1>
              Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. 
            </Grid.Row>
            <Grid.Row>
              <h1>Valence</h1>
              Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).
            </Grid.Row>
            </div>
          </Grid.Column>
          </Grid>
        </div>
        {recommendedTracks && 
         <>
          <h1>Some tunes you may enjoy</h1>
          <List inverted link animated>
            {recommendedTracks.tracks.map(track => (
              <List.Item onClick={() => handleTrackClick(track)} active={false} as='a'>
                {track.name} by {track.artists.map(artist => artist.name).join(', ')}
              </List.Item>
            ))}
          </List>
         </>
        }
      </Segment>
    </div>
  );
}

export default Discover;
