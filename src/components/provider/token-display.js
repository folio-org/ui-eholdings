import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export default function TokenDisplay({ model }) {
  if (model.providerToken.value) {
    return (
      <div data-test-eholdings-provider-details-token>
        <span>{model.providerToken.prompt}&nbsp;:&nbsp;{model.providerToken.value}</span>
      </div>);
  } else {
    return (
      <span><FormattedMessage id="ui-eholdings.provider.noTokenSet" /></span>
    );
  }
}

TokenDisplay.propTypes = {
  model: PropTypes.object.isRequired
};
