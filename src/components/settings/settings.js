import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './settings.css';

const cx = classNames.bind(styles);

export default class Settings extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    customerId: this.props.settings['customer-id'] || '',
    apiKey: this.props.settings['api-key'] || '',
    invalidCustomerId: false,
    invalidApiKey: false
  };

  componentWillReceiveProps(nextProps) {
    let { customerId, apiKey } = this.state;
    let { update, settings: next } = nextProps;

    let isDirty = customerId !== next['customer-id'] || apiKey !== next['api-key'];

    if (update.isResolved && isDirty) {
      this.setState({
        customerId: next['customer-id'],
        apiKey: next['api-key']
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
      customerId: settings['customer-id'],
      apiKey: settings['api-key'],
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
    let { settings, update } = this.props;

    let isFresh = !customerId && !apiKey;
    let isDirty = customerId !== settings['customer-id'] || apiKey !== settings['api-key'];
    let isValid = customerId && apiKey;

    return (
      <div className={styles['eholdings-settings']}>
        <h1>eHoldings</h1>

        <h2 data-test-eholdings-settings-description>
          EBSCO Knowledge Base
        </h2>

        <form
          onSubmit={this.handleSubmit}
          data-test-eholdings-settings
        >
          {update.isRejected && (
            <p data-test-eholdings-settings-error>
              {update.error.length ? update.error[0].message : update.error.message}
            </p>
          )}

          <div
            data-test-eholdings-settings-customerid
            className={cx(styles['eholdings-settings-field'], {
              'has-error': invalidCustomerId
            })}
          >
            <label htmlFor="eholdings-settings-customerid">Customer ID</label>
            <input
              id="eholdings-settings-customerid"
              type="text"
              autoComplete="off"
              value={customerId}
              onChange={this.updateCustomerId}
              onBlur={this.validateCustomerId}
            />
          </div>

          <div
            data-test-eholdings-settings-apikey
            className={cx(styles['eholdings-settings-field'], {
              'has-error': invalidApiKey
            })}
          >
            <label htmlFor="eholdings-settings-apikey">API Key</label>
            <input
              id="eholdings-settings-apikey"
              type="text"
              autoComplete="off"
              value={apiKey}
              onChange={this.updateApiKey}
              onBlur={this.validateApiKey}
            />
          </div>

          {(isFresh || isDirty) && (
            <div className={styles['eholdings-settings-form-actions']} data-test-eholdings-settings-actions>
              <button type="submit" disabled={!isValid || update.isPending}>Save</button>
              <button type="reset" onClick={this.handleClear}>Cancel</button>
              <div className={styles['eholdings-settings-save-error']} data-test-eholdings-settings-error>{update.message}</div>
            </div>
          )}
        </form>
      </div>
    );
  }
}
