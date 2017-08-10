import React from 'react';
import { Link } from 'react-router-dom';
import Logo from 'svg-react-loader?name=Logo!./frontside-icon-transparent.svg';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import style from './front.css';

export default function Front() {
  return (
    <div className={style.front}>
      <h1><Logo className={style.logo}/> Frontside FOLIO</h1>
      <p>
        Welcome to the Frontside FOLIO demo. Here you'll find a showcase of the applications and modules that we've been working on.
      </p>

      <p>While we wire up the general search and navigation system for e-holdings, please have a look at these direct links as a starting point:</p>

        <h3>Vendors</h3>
        <ul>
          <li><Link to="/eholdings/vendors/6">Economist Intelligence Unit</Link></li>
          <li><Link to="/eholdings/vendors/7">Edinburgh University Press</Link></li>
        </ul>
        {/*
            <h3>Packages</h3>
              <ul>
                <li><Link to="/eholdings/vendors/6/packages/26">EIU: Country Reports Archive (DFG Nationallizenz)</Link></li>
                <li><Link to="/eholdings/vendors/7/packages/27">Digimap Ordnance Survey</Link></li>
            </ul>
        */}

      <p>
        <em>
          Note that the network requests are connecting to a server populated with mock data and not actually sourcing from the Ebsco resource management API.
        </em>
      </p>
    </div>
  );
}
