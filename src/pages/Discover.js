import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { Button } from 'semantic-ui-react'
import '../styles/Discover.css'

const Discover = () => {

  const [spotifyAuthToken, setSpotifyAuthToken] = useState()

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get('spotifyAuthToken'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('spotifyAuthToken')])
  
  const [data, setData] = useState()

  async function doSomething() {
    const stuff = "?max_energy=0.4&max_valence=0.5"
    const res = await fetch(`https://api.spotify.com/v1/recommendations` + stuff, {
      headers: {
        Authorization: `Bearer ${spotifyAuthToken}`,
      },
    }).then((res) => setData(res.json()));
  }

  return (
    <div className="discover">
      Discover {spotifyAuthToken}
      <Button onClick={() => doSomething()}>Search</Button>
      <Button onClick={() => console.log(data)}></Button>
    </div>
  );
}

export default Discover;
