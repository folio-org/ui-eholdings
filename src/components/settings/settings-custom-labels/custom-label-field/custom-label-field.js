import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Checkbox,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { getMatchedStringInUTF8 } from '../../../utilities';

export default class CustomLabelField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  validateLabel = (name, value, allValues) => {
    const utf8Value = value ? getMatchedStringInUTF8(value) : value;

    const displayOnFullTextFinder = allValues[name] ? allValues[name].displayOnFullTextFinder : false;
    const displayOnPublicationFinder = allValues[name] ? allValues[name].displayOnPublicationFinder : false;

    if (value && value.length > 50) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.customLabels.length" />;
    } else if (utf8Value !== value) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.customLabels.utf" />;
    } else if (!value && (displayOnFullTextFinder || displayOnPublicationFinder)) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.customLabels.empty" />;
    } else {
      return undefined;
    }
  }

  render() {
    const { name } = this.props;

    return (
      <Row
        data-test-settings-custom-label
        key={name}
      >
        <Col xs={4}>
          <Field
            autoFocus
            component={TextField}
            name={`${name}.displayLabel`}
            validate={(value, allValues) => this.validateLabel(name, value, allValues)}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={Checkbox}
            name={`${name}.displayOnPublicationFinder`}
            type='checkbox'
          />
        </Col>
        <Col xs={4}>
          <Field
            component={Checkbox}
            name={`${name}.displayOnFullTextFinder`}
            type='checkbox'
          />
        </Col>
      </Row>
    );
  }
}
