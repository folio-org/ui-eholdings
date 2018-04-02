import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Icon
} from '@folio/stripes-components';
import styles from './inline-form.css';

export default class InlineForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    isPending: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
  }

  render() {
    let {
      pristine,
      isPending,
      onSubmit,
      onCancel
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        {this.props.children}
        <div className={styles['inline-form-action-buttons']}>
          <div
            data-test-eholdings-inline-form-cancel-button
            className={styles['inline-form-action-button']}
          >
            <Button
              disabled={isPending}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
          <div
            data-test-eholdings-inline-form-save-button
            className={styles['inline-form-action-button']}
          >
            <Button
              disabled={pristine || isPending}
              type="submit"
              buttonStyle="primary"
            >
              {isPending ? 'Saving' : 'Save' }
            </Button>
          </div>
          {isPending && (
            <Icon icon="spinner-ellipsis" />
          )}
        </div>
      </form>
    );
  }
}
