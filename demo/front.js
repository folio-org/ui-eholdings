import React from 'react';
import { Link } from 'react-router-dom';
import logo from './frontside-icon.svg';
import style from './front.css';

export default function Front() {
  return (
    <div className={style.front}>
      <h1><img alt="Frontside logo" src={logo} className={style.logo} /> eHoldings, by Frontside</h1>
      <p>
        Welcome to the Frontside FOLIO demo. Here you&rsquo;ll find a showcase of the applications and modules that we&rsquo;ve been working on.
      </p>

      <p>
        Have a look at these direct links as a starting point:
      </p>

      <h3>Search</h3>
      <ul>
        <li>Search for a <Link to="/eholdings/?searchType=providers">provider</Link>, <Link to="/eholdings/?searchType=packages">package</Link>, or <Link to="/eholdings/?searchType=titles">title</Link></li>
      </ul>

      <h3>Providers</h3>
      <ul>
        <li><Link to="/eholdings/providers/432">NASA</Link></li>
        <li><Link to="/eholdings/providers/19">EBSCO</Link></li>
      </ul>

      <h3>Packages</h3>
      <ul>
        <li><Link to="/eholdings/packages/432-8208">NASA eBooks</Link></li>
        <li><Link to="/eholdings/packages/19-1125">Business Source Complete</Link></li>
      </ul>

      <h3>Titles</h3>
      <ul>
        <li><Link to="/eholdings/titles/2022451">Rockets and People, Volume 2: Creating a Rocket Industry</Link></li>
        <li><Link to="/eholdings/titles/910785">Cornell Real Estate Review</Link></li>
      </ul>

      <p>
        <em>
          The e-holdings data in this demo connects to a sample account in the EBSCO resource management API.
        </em>
      </p>
    </div>
  );
}
