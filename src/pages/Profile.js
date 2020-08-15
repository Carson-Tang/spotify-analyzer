import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { Segment } from 'semantic-ui-react'
import { SpotifyAuthListener } from 'react-spotify-auth'
import { SpotifyApiContext } from 'react-spotify-api'
import UserInfo from '../components/Profile/UserInfo'
import TopTracks from '../components/Profile/TopTracks'
import TopArtists from '../components/Profile/TopArtists'
import TopGenres from '../components/Profile/TopGenres'

const Profile = () => {
  const [spotifyAuthToken, setSpotifyAuthToken] = useState()

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get('spotifyAuthToken'))
    window.history.replaceState(null, null, ' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('spotifyAuthToken')])

  return (
    <>
      <SpotifyAuthListener onAccessToken={(token) => {Cookies.set('spotifyAuthToken', token)}} />
      <SpotifyApiContext.Provider value={spotifyAuthToken}>
        <Segment inverted>
          {/* <UserInfo /> */}
          <TopGenres />
          <TopTracks />
          <TopArtists />
        </Segment>
      </SpotifyApiContext.Provider>
    </>
  );
}

export default Profile;
