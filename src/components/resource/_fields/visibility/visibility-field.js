import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Headline, RadioButton } from '@folio/stripes/components';

class VisibilityField extends Component {
  static propTypes = {
    disabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node
    ])
  };

  render() {
    const { disabled } = this.props;
    const disabledReason = typeof disabled === 'boolean' ? '' : disabled;

    return (
      <fieldset
        data-test-eholdings-resource-visibility-field
      >
        <Headline tag="legend" size="small" margin="x-large">
          <FormattedMessage id="ui-eholdings.label.showToPatrons" />
        </Headline>

        <Field
          component={RadioButton}
          disabled={!!disabled}
          format={value => value.toString()}
          label={<FormattedMessage id="ui-eholdings.yes" />}
          name="isVisible"
          parse={value => value === 'true'}
          type="radio"
          value="true"
        />

        <Field
          component={RadioButton}
          disabled={!!disabled}
          format={value => value.toString()}
          label={
            <FormattedMessage
              id="ui-eholdings.label.no.reason"
              values={{ disabledReason }}
            />
          }
          name="isVisible"
          parse={value => value === 'true'}
          type="radio"
          value="false"
        />
      </fieldset>
    );
  }
}

export default VisibilityField;
