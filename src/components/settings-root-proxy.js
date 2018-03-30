import React, { Component } from 'react';
import SettingsDetailPane from './settings-detail-pane';

export default class SettingsRootProxy extends Component {
  render() {
    return (
      <SettingsDetailPane
        paneTitle="Root proxy"
      >
        <p>EBSCO KB API customers: please access EBSCOAdmin to setup and maintain proxies.</p>

        <p>Warning: changing the root proxy setting with override the proxy for all link and resources currently set to inherit the root proxy selection.</p>
      </SettingsDetailPane>
    );
  }
}
