import React, { useState } from 'react';
import { Button, Image, Grid, Label, List } from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'
import { UserTop, ArtistTracks, TrackAnalysis } from 'react-spotify-api'
import ReactCardCarousel from 'react-card-carousel'
import { Sunburst } from 'react-vis'
import '../../styles/TopArtists.css'

const colors = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
]

const TopArtists = () => {

  const [carousel, setCarousel] = useState()
  const [currentArtist, setCurrentArtist] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)

  function handleCarouselRef(Carousel, artists) {
    setCarousel(Carousel)
    if(currentArtist == null)
      setCurrentArtist(artists.data.items[0])
  }

  function handleCarouselChange(artists) {
    setCurrentArtist(artists.data.items[carousel.getCurrentIndex()])
  }

  function handleCurrentTrack(track){
    setCurrentTrack(track)
  }

  const [barSize, setBarSize] = useState(0.5)
  const [beatSize, setBeatSize] = useState(0.25)
  const [tatumSize, setTatumSize] = useState(0.25)

  const [beatSpace, setBeatSpace] = useState(4)
  const [tatumSpace, setTatumSpace] = useState(8)  

  function renderSunburst(data) {
    // bars > beats > tatums
    const bars = data.bars
    const beats = data.beats
    const tatums = data.tatums
    const EPS = 0.0005
    const node = { 'children': [] }
    bars.forEach(bar => {
      var barStart = bar.start
      var barEnd = bar.start + bar.duration
      node['children'].push({
        'start': barStart,
        'end': barEnd,
        'children': [],
        'color': '#fccf3e',
      })
      node['children'].push({
        'size': barSize,
        'color': '#fff',
      })
    })
    node['children'].push({
      'start': bars[bars.length-1].start,
      'end': 999999,
      'children': [],
      'color': '#fccf3e',
    })

    var x = 0
    beats.forEach(beat => {
      var beatStart = beat.start
      var beatEnd = beat.start + beat.duration
      var idx = 0
      for(var i = 0; i < node['children'].length; i++){
        var bar = node['children'][i]
        if(bar.start <= beatStart + EPS && beatEnd - EPS <= bar.end){
          idx = i;
          break;
        }
      }
      node['children'][idx]['children'].push({
        'start': beatStart,
        'end': beatEnd,
        'children': [],
        'color': '#fd9a24',
      })
      x += 1
      if(x==beatSpace){
        node['children'][idx]['children'].push({
          'size': beatSize,
          'color': '#fff',
        })
        x = 0
      }
    })
    
    var x = 0
    tatums.forEach(tatum => {
      var tatumStart = tatum.start
      var tatumEnd = tatum.start + tatum.duration
      var idx = 0
      var idx2 = 0
      for(var i = 0; i < node['children'].length; i++){
        var bar = node['children'][i]
        if(bar.start <= tatumStart + EPS && tatumEnd - EPS <= bar.end){
          idx = i;
          break;
        }
      }
      for(var i = 0; i < node['children'][idx]['children'].length; i++){
        var beat = node['children'][idx]['children'][i]
        if(beat.start <= tatumStart + EPS && tatumEnd - EPS <= beat.end){
          idx2 = i;
          break;
        }
      }
      x += 1
      node['children'][idx]['children'][idx2]['children'].push({
        'size': tatum.duration,
        'color': '#f55f20',
      })
      if(x==tatumSpace){
        node['children'][idx]['children'][idx2]['children'].push({
          'size': tatumSize,
          'color': '#fff',
        })
        x = 0
      }
    })

    return <>
      <Grid>
        <Grid.Column width={4}>
          <Grid.Row>
            <h3 className='current-track'>{currentTrack.name}</h3>
          </Grid.Row>
          <Grid.Row>
            <div className='artist-bar-slider'>
              Bar Size
              <Slider barSize style={{ trackFill: { backgroundColor: "#fa8223"}}}
                settings={{
                  start: 0.5,
                  min: 0.1,
                  max: 1,
                  step: 0.1,
                  onChange: value => {
                    setBarSize(value);
                  }
                }}
              />
              Beat Size
              <Slider beatSize style={{ trackFill: { backgroundColor: "#fa8223"}}}
                settings={{
                  start: 0.25,
                  min: 0.05,
                  max: 0.5,
                  step: 0.05,
                  onChange: value => {
                    setBeatSize(value);
                  }
                }}
              />
              Tatum Size
              <Slider tatumSize style={{ trackFill: { backgroundColor: "#fa8223"}}}
                settings={{
                  start: 0.25,
                  min: 0.05,
                  max: 0.5,
                  step: 0.05,
                  onChange: value => {
                    setTatumSize(value);
                  }
                }}
              />
              Beat Space
              <Slider beatSpace style={{ trackFill: { backgroundColor: "#fa8223"}}}
                settings={{
                  start: 4,
                  min: 2,
                  max: 8,
                  step: 2,
                  onChange: value => {
                    setBeatSpace(value);
                  }
                }}
              />
              Tatum Space
              <Slider tatumSpace style={{ trackFill: { backgroundColor: "#fa8223"}}}
                settings={{
                  start: 8,
                  min: 4,
                  max: 16,
                  step: 4,
                  onChange: value => {
                    setTatumSpace(value);
                  }
                }}
              />
              <List divided>
                <Label.Group>
                  <Label className='artist-bars-label'>
                    Bars
                    <Label.Detail>{bars.length}</Label.Detail>
                  </Label>
                  <Label className='artist-beats-label'>
                    Beats
                    <Label.Detail>{beats.length}</Label.Detail>
                  </Label>
                  <Label className='artist-tatums-label'>
                    Tatums
                    <Label.Detail>{tatums.length}</Label.Detail>
                  </Label>
                </Label.Group>
              </List>
              
            </div>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={5}>
          <Sunburst
            hideRootNode
            colorType='literal'
            height={350}
            width={350}
            data={node}
          >
          </Sunburst>
        </Grid.Column>
      </Grid>
    </>
  }

  return (
    <>
      <Grid>
        <Grid.Row>
          <UserTop type="artists">
            {(artists, loading, error) => 
              artists && artists.data ? (
                <>
                <Grid.Column width={3}>
                  <h1 className="top-artists">Your Top Artists</h1>
                  <div style={{
                    position: 'relative',
                    height: '30vh',
                    width: '200%',
                    display: 'flex',
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <ReactCardCarousel
                      spread="wide"
                      ref={ Carousel => handleCarouselRef(Carousel, artists) }
                      afterChange={ () => handleCarouselChange(artists) }
                      disable_keydown={true}
                    >
                      {artists.data.items.map(artist => (
                        <div style={{
                          height: "200px",
                          width: "200px",
                          paddingTop: "5px",
                          textAlign: "center",
                          background: "#52C0F5",
                          color: "#FFF",
                          fontFamily: "sans-serif",
                          fontSize: "15px",
                          borderRadius: "10px",
                          boxSizing: "border-box"
                        }}>
                          <div>{artist.name}</div>
                          <Image src={artist.images[0].url} />
                        </div>
                      ))}
                    </ReactCardCarousel>
                  </div>
                </Grid.Column>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={4}>
                  {currentArtist && 
                    <>
                      <h2>{currentArtist.name}</h2>
                      <h3>
                        {currentArtist.genres.map(genre => {
                          return <Label color={colors[Math.floor((genre.charCodeAt(0) - 97) / 2)]}>
                            {genre}
                        </Label>})}
                      </h3>
                      <h5>{currentArtist.followers.total.toLocaleString()} followers</h5>
                    </>}
                    { currentArtist &&
                      <ArtistTracks id={currentArtist.id}>
                        {(tracks, loading, error) => 
                          tracks && tracks.data ? (
                          <>
                            <List inverted link animated>
                              {tracks.data.tracks.map(track => (
                                <List.Item onClick={() => handleCurrentTrack(track)} active={false} as='a'>
                                  {track.name}
                                </List.Item>
                              ))}
                            </List>
                          </>) : null
                        }
                      </ArtistTracks>
                    }
                </Grid.Column>
                <Grid.Column width={7}>
                  { currentTrack && 
                    <TrackAnalysis id={currentTrack.id}>
                      {(analysis, loading, error) => (
                        analysis && analysis.data ? (
                          <>
                          { renderSunburst(analysis.data) }
                          </>
                        ) : null
                      )}
                    </TrackAnalysis>
                  }
                  {
                    !currentTrack && currentArtist && 
                    <>
                    <ArtistTracks id={currentArtist.id}>
                      {(tracks, loading, error) => (
                        tracks && tracks.data ? 
                        <>
                        <Button onClick={() => console.log(tracks)}></Button>
                        { setCurrentTrack(tracks.data.tracks[0]) }
                        </> : null
                      )}
                    </ArtistTracks>
                    </>
                  }
                </Grid.Column>
                </>
              ) : null
            }
          </UserTop>
        </Grid.Row>
      </Grid>
    </>
  );
}

export default TopArtists;