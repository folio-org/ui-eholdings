import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  TextArea
} from '@folio/stripes/components';

export default class TokenField extends Component {
  static propTypes = {
    token: PropTypes.object,
    tokenValue: PropTypes.string,
    type: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      showInputs: this.props.tokenValue
    };
  }

  toggleInputs = () => {
    this.setState(({ showInputs }) => ({
      showInputs: !showInputs
    }));
  }

  validate(value) {
    return value && value.length > 500 ? (
      <FormattedMessage id="ui-eholdings.validate.errors.token.length" />
    ) : undefined;
  }

  render() {
    /* eslint-disable react/no-danger */
    const { token, type } = this.props;
    const { showInputs } = this.state;
    const helpTextMarkup = { __html: token.helpText };

    return (showInputs) ? (
      <div>
        <div
          data-test-eholdings-token-fields-help-text={type}
          dangerouslySetInnerHTML={helpTextMarkup}
        />
        <div data-test-eholdings-token-fields-prompt={type}>
          {token.prompt}
        </div>
        <div data-test-eholdings-token-value-textarea={type}>
          {type === 'provider' ? (
            <Field name="providerTokenValue" component={TextArea} validate={this.validate} />
          ) : (
            <Field name="packageTokenValue" component={TextArea} validate={this.validate} />
          )}
        </div>
      </div>
    ) : (
      <div
        data-test-eholdings-token-add-button={type}
      >
        <Button
          type="button"
          onClick={this.toggleInputs}
        >
          <Icon icon="plus-sign">
            {type === 'provider' ? (
              <FormattedMessage id="ui-eholdings.provider.token.addToken" />
            ) : (
              <FormattedMessage id="ui-eholdings.package.token.addToken" />
            )}
          </Icon>
        </Button>
      </div>
    );
  }
}
