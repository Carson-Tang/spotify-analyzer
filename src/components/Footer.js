import React from 'react';
import '../styles/Footer.css'
import { Icon } from 'semantic-ui-react'

const Footer = () => {

  return (
    <div className="footer">
      <div>Made with ❤️ and 🍜 by Carson</div>
      <Icon color='black' name='github' size='large' link="" />
    </div>
  );
}

export default Footer;
