import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Checkbox,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { getMatchedStringInUTF8 } from '../../../utilities';
import { CUSTOM_LABELS_DISPLAY_LABEL_MAX_LENGTH } from '../../../../constants';

const propTypes = {
  name: PropTypes.string.isRequired,
};

const CustomLabelField = ({ name }) => {
  const stripes = useStripes();
  const disabled = !stripes.hasPerm('ui-eholdings.settings.custom-labels.edit');

  const validateLabel = (label, value, allValues) => {
    const utf8Value = value ? getMatchedStringInUTF8(value) : value;

    const displayOnFullTextFinder = allValues[label] ? allValues[label].displayOnFullTextFinder : false;
    const displayOnPublicationFinder = allValues[label] ? allValues[label].displayOnPublicationFinder : false;

    if (value && value.length > CUSTOM_LABELS_DISPLAY_LABEL_MAX_LENGTH) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.customLabels.length" />;
    } else if (utf8Value !== value) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.customLabels.utf" />;
    } else if (!value && (displayOnFullTextFinder || displayOnPublicationFinder)) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.customLabels.empty" />;
    } else {
      return undefined;
    }
  };

  return (
    <Row
      data-test-settings-custom-label
      key={name}
    >
      <Col xs={4}>
        <FormattedMessage id="ui-eholdings.settings.customLabels.displayLabel">
          {label => (
            <Field
              data-testid={`${name}-display-label`}
              autoFocus
              component={TextField}
              name={`${name}.displayLabel`}
              validate={(value, allValues) => validateLabel(name, value, allValues)}
              aria-label={label}
              disabled={disabled}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col xs={4}>
        <FormattedMessage id="ui-eholdings.settings.customLabels.publicationFinder">
          {label => (
            <Field
              data-testid={`${name}-publication-finder`}
              component={Checkbox}
              name={`${name}.displayOnPublicationFinder`}
              type='checkbox'
              aria-label={label}
              disabled={disabled}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col xs={4}>
        <FormattedMessage id="ui-eholdings.settings.customLabels.textFinder">
          {label => (
            <Field
              data-testid={`${name}-text-finder`}
              component={Checkbox}
              name={`${name}.displayOnFullTextFinder`}
              type='checkbox'
              aria-label={label}
              disabled={disabled}
            />
          )}
        </FormattedMessage>
      </Col>
    </Row>
  );
};

CustomLabelField.propTypes = propTypes;

export default CustomLabelField;
