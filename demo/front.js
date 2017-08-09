import React from 'react';
import { Link } from 'react-router-dom';
import Logo from 'svg-react-loader?name=Logo!./frontside-icon-transparent.svg';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import style from './front.css';

export default function Front() {
  return (
    <div className={style.front}>
      <Logo className={style.logo}/>
      <div className={style.content}>
        <h1>Frontside FOLIO</h1>
        <p>
          Welcome to the frontside folio demo. Here you'll find a showcase of the applications and modules that we've been working on.
        </p>

        <p>While we wire up the general search and navigation system for e-holdings, please have a look at these direct links as a starting point:</p>

        <h3>Vendors</h3>
        <ul>
          <li><Link to="/eholdings/vendors/1">Bob Martin and Sons</Link></li>
          <li><Link to="/eholdings/vendors/2">Vendore Fantastico</Link></li>
        </ul>
        <h3>Packages</h3>
        <ul>
          <li><Link to="/eholdings/packages/1">Harvard Busines Review</Link></li>
          <li><Link to="/eholdings/packages/2">Bird Person E-Content</Link></li>
        </ul>

        <blockquote>
          Note that the network requests are connecting to a server populated with mock data and not actually sourcing directly from the Ebsco resource management API
        </blockquote>
      </div>
    </div>
  );
}
