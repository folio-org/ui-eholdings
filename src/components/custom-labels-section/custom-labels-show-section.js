import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import KeyValueColumns from '../key-value-columns';

export default class CustomLabelsShowSection extends Component {
  static propTypes = {
    customLabels: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        displayLabel: PropTypes.string,
        id: PropTypes.number,
      }),
    })).isRequired,
    userDefinedFields: PropTypes.objectOf(PropTypes.string).isRequired,
  }

  render() {
    const {
      customLabels,
      userDefinedFields,
    } = this.props;

    return (
      <KeyValueColumns>
        {customLabels.map(({ attributes }) => {
          const {
            displayLabel,
            id,
          } = attributes;
          const value = userDefinedFields[`userDefinedField${id}`];

          return (
            <KeyValue
              data-test-eholdings-resource-custom-label
              key={id}
              label={displayLabel}
              value={value || <NoValue />}
            />
          );
        })}
      </KeyValueColumns>
    );
  }
}
