import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

class CustomLabelEditSection extends Component {
  static propTypes = {
    customLabels: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        displayLabel: PropTypes.string,
        id: PropTypes.number,
      })
    })).isRequired,
    userDefinedFields: PropTypes.objectOf(PropTypes.string).isRequired,
  }

  validateStringLength = (value) => {
    const message = <FormattedMessage id="ui-eholdings.validate.errors.customLabels.length" />;

    return value && value.length > 100 ? message : undefined;
  }

  render() {
    const {
      customLabels,
      userDefinedFields,
    } = this.props;

    return (
      <Row>
        {customLabels.map(({ attributes }) => {
          const {
            displayLabel,
            id,
          } = attributes;
          const fieldName = `userDefinedField${id}`;
          const value = userDefinedFields[fieldName] || '';

          return (
            <Col
              data-test-eholdings-resource-edit-custom-labels-fields
              key={id}
              xs={6}
            >
              <Field
                component={TextField}
                initialValue={value}
                label={displayLabel}
                name={fieldName}
                parse={v => v}
                type="text"
                validate={this.validateStringLength}
              />
            </Col>
          );
        })}
      </Row>
    );
  }
}

export default CustomLabelEditSection;
