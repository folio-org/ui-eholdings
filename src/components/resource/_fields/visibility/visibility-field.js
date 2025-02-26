import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Headline, RadioButton } from '@folio/stripes/components';

import fieldsetStyles from '../../../fieldset-styles.css';

const VisibilityField = ({ disabled = false }) => {
  const disabledReason = typeof disabled === 'boolean' ? '' : disabled;

  return (
    <fieldset
      data-test-eholdings-resource-visibility-field
      data-testid="resource-visibility-field"
      className={fieldsetStyles.fieldset}
    >
      <Headline
        tag="legend"
        className={fieldsetStyles.label}
      >
        <FormattedMessage id="ui-eholdings.label.showToPatrons" />
      </Headline>

      <Field
        component={RadioButton}
        disabled={!!disabled}
        format={value => value?.toString()}
        label={<FormattedMessage id="ui-eholdings.yes" />}
        name="isVisible"
        parse={value => value === 'true'}
        type="radio"
        value="true"
      />

      <Field
        component={RadioButton}
        disabled={!!disabled}
        format={value => value?.toString()}
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
};

VisibilityField.propTypes = {
  disabled: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]),
};

export default VisibilityField;
