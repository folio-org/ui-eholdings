import { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { CUSTOM_LABELS_VALUE_MAX_LENGTH } from '../../constants';

class CustomLabelsEditSection extends Component {
  static propTypes = {
    customLabels: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        displayLabel: PropTypes.string,
        id: PropTypes.number,
      })
    })).isRequired,
  }

  validateStringLength = (value) => {
    const message = (
      <FormattedMessage
        id="ui-eholdings.validate.errors.customLabels.length"
        values={{ amount: CUSTOM_LABELS_VALUE_MAX_LENGTH }}
      />
    );

    return value && value.length > CUSTOM_LABELS_VALUE_MAX_LENGTH ? message : undefined;
  }

  render() {
    const {
      customLabels,
    } = this.props;

    return (
      <Row>
        {customLabels.map(({ attributes }) => {
          const {
            displayLabel,
            id,
          } = attributes;
          const fieldName = `userDefinedField${id}`;

          return (
            <Col
              data-test-eholdings-resource-edit-custom-labels-fields
              key={id}
              xs={6}
            >
              <Field
                component={TextField}
                label={displayLabel}
                name={fieldName}
                parse={v => v}
                type="text"
                validate={this.validateStringLength}
                data-testid="custom-label-field"
              />
            </Col>
          );
        })}
      </Row>
    );
  }
}

export default CustomLabelsEditSection;
