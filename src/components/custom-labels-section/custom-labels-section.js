import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import KeyValueColumns from '../key-value-columns';

export default class CustomLabelsSection extends React.Component {
  static propTypes = {
    customLabels: PropTypes.array.isRequired,
    userDefinedFields: PropTypes.object.isRequired,
  }

  render() {
    const {
      customLabels,
      userDefinedFields,
    } = this.props;

    return (
      <KeyValueColumns>
        {
          customLabels.map(({ attributes }) => {
            const value = userDefinedFields[`userDefinedField${attributes.id}`];

            return (
              <KeyValue
                data-test-eholdings-resource-custom-label
                key={attributes.id}
                label={attributes.displayLabel}
                value={value || <NoValue />}
              />
            );
          })
        }
      </KeyValueColumns>
    );
  }
}
