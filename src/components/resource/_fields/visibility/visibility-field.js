import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { RadioButton, RadioButtonGroup } from '@folio/stripes-components';
import styles from './visibility-field.css';

class VisibilityField extends Component {
  static propTypes = {
    disabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    intl: intlShape.isRequired
  };

  render() {
    let { disabled, intl } = this.props;
    let disabledReason = typeof disabled === 'string' ? disabled : '';

    return (
      <div
        className={styles['visibility-field']}
        data-test-eholdings-resource-visibility-field
      >
        <Field
          name="isVisible"
          label={<FormattedMessage id="ui-eholdings.label.showToPatrons" />}
          component={RadioButtonGroup}
          disabled={!!disabled}
        >
          <RadioButton label={intl.formatMessage({ id: 'ui-eholdings.yes' })} value="true" />
          <RadioButton label={intl.formatMessage({ id: 'ui-eholdings.label.no.reason' }, { disabledReason })} value="false" />
        </Field>
      </div>
    );
  }
}

export default injectIntl(VisibilityField);
