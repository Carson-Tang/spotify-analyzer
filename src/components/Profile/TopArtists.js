import React, { useState } from 'react';
import { Button, Image, Grid } from 'semantic-ui-react'
import { UserTop } from 'react-spotify-api'
import ReactCardCarousel from 'react-card-carousel'
import '../../styles/TopArtists.css'

const TopArtists = () => {

  const [carousel, setCarousel] = useState()
  const [currentArtist, setCurrentArtist] = useState(null)

  function handleCarouselRef(Carousel, artists) {
    setCarousel(Carousel)
    if(currentArtist == null)
      setCurrentArtist(artists.data.items[0])
  }

  function handleCarouselChange(artists) {
    setCurrentArtist(artists.data.items[carousel.getCurrentIndex()])
  }

  return (
    <>
      <Grid>
        <Grid.Row>
          <h1 className="top-artists">Your Top Artists</h1>
          <UserTop type="artists">
            {(artists, loading, error) => 
              artists && artists.data ? (
                <>
                <Grid.Column width={5}>
                <div style={{
                  position: 'relative',
                  height: '30vh',
                  width: '100%',
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
                <Grid.Column width={6}>
                  {currentArtist && 
                    <>
                      <div>{currentArtist.name}</div>
                      <div>{currentArtist.genres.join(', ')}</div>
                      <h5>{currentArtist.followers.total.toLocaleString()} followers</h5>
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