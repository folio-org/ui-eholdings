import React, { Component } from 'react';

/* eslint-disable import/first */
import createMemoryHistory from 'history/createMemoryHistory';
import { okapi, config } from 'stripes-config'; // eslint-disable-line import/no-unresolved
import configureEpics from '@folio/stripes-core/src/configureEpics';
import configureLogger from '@folio/stripes-core/src/configureLogger';
import configureStore from '@folio/stripes-core/src/configureStore';
import { discoverServices } from '@folio/stripes-core/src/discoverServices';
import gatherActions from '@folio/stripes-core/src/gatherActions';
import { setOkapiReady } from '@folio/stripes-core/src/okapiActions';

// load these in our tests
import 'typeface-source-sans-pro';
import '@folio/stripes-components/lib/global.css';

import Root from '@folio/stripes-core/src/components/Root';

const actionNames = gatherActions();

/**
 * A component to setup a complete Stripes application with our
 * testing apparatus in place. Normally, stripes is booted using
 * `@folio/stripes-core/src/index.js` Which acts as the `main()`
 * function of a stripes app. This provides an alternative environment
 * and is responsible for the top level render.
 *
 * Among other things, it installs Mirage, and also provides a method
 * for interacting with the custom history.
 */
export default class TestHarness extends Component {
  constructor() {
    super();
    this.logger = configureLogger(config);
    this.epics = configureEpics();
    this.store = configureStore({ okapi }, this.logger, this.epics);
    this.history = createMemoryHistory();

    discoverServices(this.store);

    // While we have disableAuth on, manually tell our app Okapi is ready
    this.store.dispatch(setOkapiReady());
  }

  /**
   * Simulate navigation to the path or location. E.g.
   *
   *  this.visit('/eholdings/providers?query=hbr');
   *  // or
   *  this.visit({pathname: '/eholdings/providers', search: '?query=hbr');
   *
   * @method visit
   * @param {string | Location} path
   * @see https://reacttraining.com/react-router/web/api/location
   */
  visit(path) {
    this.history.push(path);
  }

  render() {
    return (
      <Root
        store={this.store}
        epics={this.epics}
        logger={this.logger}
        config={config}
        okapi={okapi}
        history={this.history}
        actionNames={actionNames}
        disableAuth
      />
    );
  }
}
