import React, { useState } from 'react';
import { Button, Image, Grid, Label, List } from 'semantic-ui-react'
import { UserTop, TrackAnalysis } from 'react-spotify-api'
import ReactCardCarousel from 'react-card-carousel'
import { Sunburst } from 'react-vis'
import { Slider } from 'react-semantic-ui-range'
//import '../../styles/TopTracks.css'
import '../../../node_modules/react-vis/dist/style.css'

const pitchClass = {
  '0':  'C',
  '1':  'C#/D♭',
  '2':  'D',
  '3':  'D#/E♭',
  '4':  'E',
  '5':  'F',
  '6':  'F#/G♭',
  '7':  'G',
  '8':  'G#/A♭',
  '9':  'A',
  '10': 'A#/B♭',
  '11': 'B',
}

const mode = {
  '0':  'Minor',
  '1':  'Major',
  '-1': 'No Result',
}

const TopTracks = () => {

  const [carousel, setCarousel] = useState()
  const [currentTrack, setCurrentTrack] = useState(null)

  const [barSize, setBarSize] = useState(0.5)
  const [beatSize, setBeatSize] = useState(0.25)
  const [tatumSize, setTatumSize] = useState(0.25)

  const [beatSpace, setBeatSpace] = useState(4)
  const [tatumSpace, setTatumSpace] = useState(8)  


  function handleCarouselRef(Carousel, tracks) {
    setCarousel(Carousel)
    if(currentTrack == null){
      setCurrentTrack(tracks.data.items[0])
    }
  }

  function handleCarouselChange(tracks) {
    setCurrentTrack(tracks.data.items[carousel.getCurrentIndex()])
  }

  function toMMSS(seconds) {
    const mm = Math.floor(seconds / 60)
    const ss = Math.floor(seconds % 60)
    return mm + ':' + ss
  }

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
        'color': '#0059b3',
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
      'color': '#0059b3',
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
        'color': '#0481ff',
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
        'color': '#3f9fff',
      })
      if(x==tatumSpace){
        node['children'][idx]['children'][idx2]['children'].push({
          'size': tatumSize,
          'color': '#fff',
        })
        x = 0
      }
    })
    console.log(node)

    return <>
      <Grid>
        <Grid.Column width={4}>
          Bar Size
          <Slider barSize style={{ trackFill: { backgroundColor: "#3498db"}}} settings={{
            start: 0.5,
            min: 0.1,
            max: 1,
            step: 0.1,
            onChange: value => {
              setBarSize(value);
            }
          }} />
          Beat Size
          <Slider beatSize style={{ trackFill: { backgroundColor: "#3498db"}}} settings={{
            start: 0.25,
            min: 0.05,
            max: 0.5,
            step: 0.05,
            onChange: value => {
              setBeatSize(value);
            }
          }} />
          Tatum Size
          <Slider tatumSize style={{ trackFill: { backgroundColor: "#3498db"}}} settings={{
            start: 0.25,
            min: 0.05,
            max: 0.5,
            step: 0.05,
            onChange: value => {
              setTatumSize(value);
            }
          }} />
          Beat Space
          <Slider beatSpace style={{ trackFill: { backgroundColor: "#3498db"}}} settings={{
            start: 4,
            min: 2,
            max: 8,
            step: 2,
            onChange: value => {
              setBeatSpace(value);
            }
          }} />
          Tatum Space
          <Slider tatumSpace style={{ trackFill: { backgroundColor: "#3498db"}}} settings={{
            start: 8,
            min: 4,
            max: 16,
            step: 4,
            onChange: value => {
              setTatumSpace(value);
            }
          }} />
          <List divided>
            <Label.Group color='orange'>
              <Label>
                Bars
                <Label.Detail>{bars.length}</Label.Detail>
              </Label>
              <Label>
                Beats
                <Label.Detail>{beats.length}</Label.Detail>
              </Label>
              <Label>
                Tatums
                <Label.Detail>{tatums.length}</Label.Detail>
              </Label>
            </Label.Group>
          </List>
        </Grid.Column>
        <Grid.Column width={5}>
          <Sunburst
            hideRootNode
            colorType='literal'
            height={400}
            width={400}
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
          
          <UserTop type="tracks">
            {(tracks, loading, error) => 
              tracks && tracks.data ? (
                <>
                <Grid.Column width={3}>
                <h1 className="top-tracks">Your Top Tracks</h1>
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
                    ref={ Carousel => handleCarouselRef(Carousel, tracks) }
                    afterChange={ () => handleCarouselChange(tracks) }
                    disable_keydown={true}
                  >
                    {tracks.data.items.map(track => (
                      <div style={{
                        height: "200px",
                        width: "200px",
                        paddingTop: "5px",
                        textAlign: "center",
                        background: "#52C0F5",
                        color: "#fff",
                        fontFamily: "sans-serif",
                        fontSize: "15px",
                        borderRadius: "10px",
                        boxSizing: "border-box"
                      }}>
                        <div>{track.name}</div>
                        <div>{track.artists.map(artist => artist.name).join(', ')}</div>
                        <Image src={track.album.images[0].url} />
                      </div>
                    ))}
                  </ReactCardCarousel>
                </div>
                </Grid.Column>
                <Grid.Column width={2}></Grid.Column>
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
                </Grid.Column>
                <Grid.Column width={4}>
                  {currentTrack &&
                    <>
                      <h2>
                        {currentTrack.name} {' '}
                        <Label color={currentTrack.explicit ? 'red' : 'green'}>
                          {currentTrack.explicit ? 'Explicit' : 'Clean'}
                        </Label>
                      </h2>
                      <h3>{currentTrack.artists.map(artist => artist.name).join(', ')}</h3>
                      <TrackAnalysis id={currentTrack.id}>
                        {(analysis, loading, error) => (
                          analysis && analysis.data ? (
                            <>
                              <h5>Duration: {toMMSS(analysis.data.track.duration)}</h5>
                              <h5>Tempo: {analysis.data.track.tempo} (BPM)</h5>
                              <h5>Pitch Class: {pitchClass[analysis.data.track.key]}</h5>
                              <h5>Modality: {mode[analysis.data.track.mode]}</h5>
                              <h5>Time Signature: {analysis.data.track.time_signature}/4</h5>
                            </>
                          ) : null
                        )}
                      </TrackAnalysis>
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

export default TopTracks;
