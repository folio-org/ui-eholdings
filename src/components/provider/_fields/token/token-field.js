import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'react-intl';

import {
  Button,
  TextArea
} from '@folio/stripes-components';
import styles from './token-field.css';

class TokenField extends Component {
  static propTypes = {
    showInputs: PropTypes.bool,
    model: PropTypes.object
  };

  state = {
    showInputs: this.props.showInputs
  };

  toggleInputs = () => {
    this.setState(({ showInputs }) => ({
      showInputs: !showInputs
    }));
  }


  render() {
    /* eslint-disable react/no-danger */
    let { model } = this.props;
    let { showInputs } = this.state;
    let helpTextMarkup = { __html: model.providerToken.helpText };

    return (showInputs) ? (
      <div className={styles['token-fields']}>
        <div
          data-test-eholdings-token-fields-help-text
          className={styles['token-help-text']}
          dangerouslySetInnerHTML={helpTextMarkup}
        />
        <div data-test-eholdings-token-fields-prompt className={styles['token-prompt-text']}>
          {model.providerToken.prompt}
        </div>
        <div data-test-eholdings-token-value-textarea className={styles['token-value-textarea']}>
          <Field
            name="tokenValue"
            component={TextArea}
          />
        </div>
      </div>
    ) : (
      <div
        className={styles['token-add-row-button']}
        data-test-eholdings-token-add-button
      >
        <Button
          type="button"
          onClick={this.toggleInputs}
        >
          <FormattedMessage id="ui-eholdings.provider.token.addToken" />
        </Button>
      </div>
    );
  }
}

export default injectIntl(TokenField);

export function validate(values, props) {
  const errors = {};
  let { intl } = props;

  if (values.tokenValue && values.tokenValue.length > 500) {
    errors.tokenValue = intl.formatMessage({ id: 'ui-eholdings.validate.errors.token.length' });
  }

  return errors;
}
