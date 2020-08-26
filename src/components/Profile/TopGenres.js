import React from 'react';
import { Button, Grid, Label } from 'semantic-ui-react'
import { User, UserTop } from 'react-spotify-api'
import '../../styles/TopGenres.css'

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

const TopGenres = () => {

  function getFavouriteGenres(artists) {
    let genres = {}
    artists.forEach(artist => {
      artist.genres.forEach(genre => {
        if(genres[genre]) {
          genres[genre]++;
        } else {
          genres[genre] = 1;
        }
      });
    });
    genres = Object.entries(genres)
    genres.sort(function compare(a, b) { return b[1] - a[1] })
    let res = []
    genres.forEach(genre => {
      res.push(genre[0])
    })
    return res.slice(0, Math.min(res.length, 10))
  }

  return (
    <>
      <UserTop type="artists" options={{limit: 50}}>
        {(artists, loading, error) => 
          artists && artists.data ? (
            <>
            <Grid>
              <Grid.Row>
                <h1 className='top-genres'>Favourite Genres</h1>
              </Grid.Row>
              <Grid.Row>
                <div className='genres'>                  
                  { getFavouriteGenres(artists.data.items).map(genre => {
                    return <>
                      <Label color={colors[Math.floor((genre.charCodeAt(0) - 97) / 2)]}>
                        {genre}
                      </Label>
                    </>
                  }) }
                </div>
              </Grid.Row>
            </Grid>
            </>
          ) : null
        }
      </UserTop>
    </>
  );
}

export default TopGenres;
