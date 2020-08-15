import React, { useState, useEffect } from 'react';
import { Statistic, Icon, Image } from 'semantic-ui-react'
import { SpotifyAuth } from 'react-spotify-auth';
import Cookies from 'js-cookie'
import 'react-spotify-auth/dist/index.css'
import '../styles/Login.css';

const scopes = [
  'user-read-playback-state',
  'user-modify-playback-state',
  //'user-read-currently-playing',
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-library-modify',
  //'user-top-read',
  //'user-follow-read',
  //'user-follow-modify',
]

const Login = () => {
  const [spotifyAuthToken, setSpotifyAuthToken] = useState()

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get('spotifyAuthToken'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('spotifyAuthToken')])

  return (
    <>
      <div className="login">
        <SpotifyAuth
          btnClassName="spotify-auth-btn"
          noLogo={true}
          redirectUri='http://localhost:3000/profile'
          clientID='438448d4bf4440ab9429849d1bd777f9'
          scopes={scopes}
        />
      </div>
      {/*
      mood - slider maybe
      tempo - slider
      acoustic
      danceability 
      energy
      valence
      tempo

      */ }
      <Statistic.Group widths={7}>
        <Statistic />
        <Statistic>
          <Statistic.Value>22</Statistic.Value>
          <Statistic.Label>Bars</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value text>
            Three
            <br />
            Thousand
          </Statistic.Value>
          <Statistic.Label>Beats</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name='plane' />5
          </Statistic.Value>
          <Statistic.Label>Sections</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Image src='/images/avatar/small/joe.jpg' className='circular inline' />
            42
          </Statistic.Value>
          <Statistic.Label>Segments</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Image src='/images/avatar/small/joe.jpg' className='circular inline' />
            42
          </Statistic.Value>
          <Statistic.Label>Tatums</Statistic.Label>
        </Statistic>
        <Statistic />
      </Statistic.Group>
    </>
  );
}

export default Login;
