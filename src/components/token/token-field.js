import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  TextArea
} from '@folio/stripes/components';
import styles from './token-field.css';

class TokenField extends Component {
  static propTypes = {
    token: PropTypes.object,
    tokenValue: PropTypes.string,
    type: PropTypes.string
  };

  state = {
    showInputs: this.props.tokenValue
  };

  toggleInputs = () => {
    this.setState(({ showInputs }) => ({
      showInputs: !showInputs
    }));
  }


  render() {
    /* eslint-disable react/no-danger */
    let { token, type } = this.props;
    let { showInputs } = this.state;
    let helpTextMarkup = { __html: token.helpText };

    return (showInputs) ? (
      <div className={styles['token-fields']}>
        <div
          data-test-eholdings-token-fields-help-text={type}
          className={styles['token-help-text']}
          dangerouslySetInnerHTML={helpTextMarkup}
        />
        <div data-test-eholdings-token-fields-prompt={type} className={styles['token-prompt-text']}>
          {token.prompt}
        </div>
        <div data-test-eholdings-token-value-textarea={type} className={styles['token-value-textarea']}>
          {type === 'provider' ? (<Field name="providerTokenValue" component={TextArea} />) : (<Field name="packageTokenValue" component={TextArea} />)}
        </div>
      </div>
    ) : (
      <div
        className={styles['token-add-row-button']}
        data-test-eholdings-token-add-button={type}
      >
        <Button
          type="button"
          onClick={this.toggleInputs}
        >
          {type === 'provider' ? (<FormattedMessage id="ui-eholdings.provider.token.addToken" />) : (<FormattedMessage id="ui-eholdings.package.token.addToken" />)}
        </Button>
      </div>
    );
  }
}

export default TokenField;

export function validate(values) {
  const errors = {};

  if ((values.providerTokenValue && values.providerTokenValue.length > 500)) {
    errors.providerTokenValue = <FormattedMessage id="ui-eholdings.validate.errors.token.length" />;
  }

  if ((values.packageTokenValue && values.packageTokenValue.length > 500)) {
    errors.packageTokenValue = <FormattedMessage id="ui-eholdings.validate.errors.token.length" />;
  }
  return errors;
}
