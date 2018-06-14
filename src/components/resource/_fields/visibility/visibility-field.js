import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { RadioButtonGroup, RadioButton } from '@folio/stripes-components';
import styles from './visibility-field.css';

export default class VisibilityField extends Component {
  static propTypes = {
    disabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ])
  };

  render() {
    let { disabled } = this.props;
    let disabledReason = typeof disabled === 'string' ? disabled : '';

    return (
      <div
        className={styles['visibility-field']}
        data-test-eholdings-resource-visibility-field
      >
        <Field
          name="isVisible"
          label="Show to patrons"
          component={RadioButtonGroup}
          disabled={!!disabled}
        >
          <RadioButton label="Yes" value="true" />
          <RadioButton label={`No ${disabledReason}`} value="false" />
        </Field>
      </div>
    );
  }
}
