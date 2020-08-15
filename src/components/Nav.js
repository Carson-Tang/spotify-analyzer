import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useUser } from 'react-spotify-api'
import { Menu, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import spotify from '../images/spotify.svg'

const Nav = () => {
  const logout = () => {
    Cookies.remove('spotifyAuthToken')
    window.location = '/'
  }

  const [spotifyAuthToken, setSpotifyAuthToken] = useState()
  const { data, loading, error } = useUser()

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get('spotifyAuthToken'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('spotifyAuthToken')])

  return (
    <Menu>
      <Menu.Item>
        <img src={spotify} />
      </Menu.Item>
      <Menu.Item header as={Link} to='/profile'>
        <Icon name='user circle outline' size='large' />
        Profile
      </Menu.Item>
      <Menu.Item header as={Link} to='/player'>
        <Icon name='music' size='large' />
        Player
      </Menu.Item>
      <Menu.Item header as={Link} to='/discover'>
        <Icon name='search' size='large' />
        Discover
      </Menu.Item>
      <Menu.Item header as={Link} to='/about' name='About' />
      <Menu.Menu position='right'>
        {data && <Menu.Item>Signed in as {data.display_name}</Menu.Item>}
        <Menu.Item as={Button} onClick={logout}>
        <Icon name='sign out' />
          Logout
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default Nav;
