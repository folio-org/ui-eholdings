import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from '@folio/stripes/components';
import styles from './inline-form.css';

export default class InlineForm extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isPending: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired
  }

  render() {
    const {
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
              <FormattedMessage id="ui-eholdings.cancel" />
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
              {isPending ?
                (<FormattedMessage id="ui-eholdings.saving" />) :
                (<FormattedMessage id="ui-eholdings.save" />)}
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
