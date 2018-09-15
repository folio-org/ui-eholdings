import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export default function TokenDisplay({ token, type }) {
  if (token.value) {
    return (
      <div data-test-eholdings-details-token={type}>
        <span>
          {`${token.prompt}`}
          :&nbsp;
          {`${token.value}`}
        </span>
      </div>);
  } else {
    return (
      <div data-test-eholdings-details-token-message={type}>
        <span>{type === 'provider' ? (<FormattedMessage id="ui-eholdings.provider.noTokenSet" />) : (<FormattedMessage id="ui-eholdings.package.noTokenSet" />)}</span>
      </div>
    );
  }
}

TokenDisplay.propTypes = {
  token: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};
