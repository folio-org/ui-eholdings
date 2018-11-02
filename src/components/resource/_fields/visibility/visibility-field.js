import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { RadioButton, RadioButtonGroup } from '@folio/stripes/components';

class VisibilityField extends Component {
  static propTypes = {
    disabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node
    ])
  };

  render() {
    let { disabled } = this.props;
    let disabledReason = typeof disabled === 'boolean' ? '' : disabled;

    return (
      <div
        data-test-eholdings-resource-visibility-field
      >
        <Field
          name="isVisible"
          label={<FormattedMessage id="ui-eholdings.label.showToPatrons" />}
          component={RadioButtonGroup}
          disabled={!!disabled}
        >
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.yes" />}
            value="true"
          />
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.label.no.reason" values={{ disabledReason }} />}
            value="false"
          />
        </Field>
      </div>
    );
  }
}

export default VisibilityField;
