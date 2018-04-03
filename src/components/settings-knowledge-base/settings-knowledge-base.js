import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Icon } from '@folio/stripes-components';
import SettingsDetailPane from '../settings-detail-pane';

import styles from './settings-knowledge-base.css';

const cx = classNames.bind(styles);

export default class SettingsKnowledgeBase extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    customerId: this.props.settings.customerId || '',
    apiKey: this.props.settings.apiKey || '',
    invalidCustomerId: false,
    invalidApiKey: false
  };

  componentWillReceiveProps(nextProps) {
    let { customerId, apiKey } = this.state;
    let { settings: old } = this.props;
    let { settings: next } = nextProps;

    let isDirty = customerId !== next.customerId || apiKey !== next.apiKey;
    let hasUpdated = old.update.isPending && next.update.isResolved;
    let hasFinishedLoading = old.isLoading && next.isLoaded;

    if (hasFinishedLoading || (hasUpdated && isDirty)) {
      this.setState({
        customerId: next.customerId,
        apiKey: next.apiKey
      });
    }
  }

  handleSubmit = (e) => {
    let { customerId, apiKey } = this.state;

    e.preventDefault();

    this.props.onSubmit({
      customerId,
      apiKey
    });
  };

  handleClear = (e) => {
    let settings = this.props.settings;

    e.preventDefault();

    this.setState({
      customerId: settings.customerId,
      apiKey: settings.apiKey,
      invalidCustomerId: false,
      invalidApiKey: false
    });
  };

  updateCustomerId = (e) => {
    this.validateCustomerId(e);
    this.setState({ customerId: e.target.value });
  };

  updateApiKey = (e) => {
    this.validateApiKey(e);
    this.setState({ apiKey: e.target.value });
  };

  validateCustomerId = (e) => {
    if (e.target.value.length > 0) {
      this.setState({ invalidCustomerId: false });
    } else {
      this.setState({ invalidCustomerId: true });
    }
  };

  validateApiKey = (e) => {
    if (e.target.value.length > 0) {
      this.setState({ invalidApiKey: false });
    } else {
      this.setState({ invalidApiKey: true });
    }
  };

  render() {
    let { customerId, apiKey, invalidCustomerId, invalidApiKey } = this.state;
    let { settings } = this.props;

    let isFresh = !customerId && !apiKey;
    let isDirty = customerId !== settings.customerId || apiKey !== settings.apiKey;
    let isValid = customerId && apiKey;

    return (
      <SettingsDetailPane
        paneTitle="Knowledge base"
      >
        <h4
          className={styles['setttings-kb-headline']}
        >
          EBSCO RM API credentials
        </h4>

        {settings.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : (
          <form
            onSubmit={this.handleSubmit}
            data-test-eholdings-settings
            className={styles['settings-kb-form']}
          >
            {settings.request.isRejected && (
              <p data-test-eholdings-settings-error>
                {settings.request.errors[0].title}
              </p>
            )}

            <div
              data-test-eholdings-settings-customerid
              className={cx(styles['settings-kb-field'], {
                'has-error': invalidCustomerId
              })}
            >
              <label htmlFor="eholdings-settings-kb-customerid">Customer ID</label>
              <input
                id="eholdings-settings-kb-customerid"
                type="text"
                autoComplete="off"
                value={customerId}
                onChange={this.updateCustomerId}
                onBlur={this.validateCustomerId}
              />
            </div>

            <div
              data-test-eholdings-settings-apikey
              className={cx(styles['settings-kb-field'], {
                'has-error': invalidApiKey
              })}
            >
              <label htmlFor="eholdings-settings-kb-apikey">API key</label>
              <input
                id="eholdings-settings-kb-apikey"
                type="password"
                autoComplete="off"
                value={apiKey}
                onChange={this.updateApiKey}
                onBlur={this.validateApiKey}
              />
            </div>

            {(isFresh || isDirty) && (
              <div className={styles['settings-kb-form-actions']} data-test-eholdings-settings-actions>
                <button type="submit" disabled={!isValid || settings.isSaving}>Save</button>
                <button type="reset" onClick={this.handleClear}>Cancel</button>

                {settings.update.isRejected && (
                  <div className={styles['settings-kb-save-error']} data-test-eholdings-settings-error>
                    {settings.update.errors[0].title}
                  </div>
                )}
              </div>
            )}
          </form>
        )}
      </SettingsDetailPane>
    );
  }
}
