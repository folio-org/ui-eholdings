import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import {
  IconButton,
  NavList,
  NavListSection,
  PaneHeader
} from '@folio/stripes-components';


import styles from './settings.css';

export default class Settings extends Component {
  static propTypes = {
    activeLink: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    let {
      activeLink,
      children
    } = this.props;

    return (
      <div className={styles['settings-paneset']}>
        <div className={styles['settings-nav-pane']}>
          <PaneHeader
            paneTitle="eHoldings"
            firstMenu={(
              <Link to="/settings" className={styles['eholdings-settings-back-button']}>
                <IconButton icon="left-arrow" />
              </Link>
            )}
          />
          <div className={styles['settings-nav-list']}>
            <NavList>
              <NavListSection activeLink={activeLink}>
                <Link to="/settings/eholdings/knowledge-base">Knowledge base</Link>
                <Link to="/settings/eholdings/root-proxy">Root proxy</Link>
              </NavListSection>
            </NavList>
          </div>
        </div>
        {children && (
          children
        )}
      </div>
    );
  }
}
