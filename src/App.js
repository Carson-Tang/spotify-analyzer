import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Login from './pages/Login'
import About from './pages/About'
import Player from './pages/Player'
import Profile from './pages/Profile'
import Discover from './pages/Discover'

import { Button } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import Footer from './components/Footer'


function App() {

  return (
    <Router>
      <div className="App">
        {!window.location.href.endsWith('/') && <Nav />}
        <Route exact path='/' component={Login} />
        <Route path='/profile' component={Profile} />
        <Route path='/player' component={Player} />
        <Route path='/discover' component={Discover} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
