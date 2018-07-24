import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Button } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

export default function SelectionStatus({ pkg, onAddToHoldings }) {
  return (
    <label data-test-eholdings-package-details-selected>
      <SelectionStatusMessage pkg={pkg} />
      <br />
      <SelectionStatusButton pkg={pkg} onAddToHoldings={onAddToHoldings} />
    </label>);
}

SelectionStatus.propTypes = {
  pkg: PropTypes.object.isRequired,
  onAddToHoldings: PropTypes.func.isRequired
};

function SelectionStatusMessage({ pkg }) {
  if (pkg.isInFlight) {
    return <Icon icon="spinner-ellipsis" />;
  } else {
    return <h4><FormattedMessage {...messageFor(pkg)} /></h4>; // eslint-disable-line no-use-before-define
  }
}

function SelectionStatusButton({ pkg, onAddToHoldings }) {
  if (pkg.isPartiallySelected || !pkg.isSelected || pkg.isInFlight) {
    let messageId = pkg.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings';
    return (
      <Button
        type="button"
        buttonStyle="primary"
        disabled={pkg.isInFlight}
        onClick={onAddToHoldings}
        data-test-eholdings-package-add-to-holdings-button
      >
        <FormattedMessage id={`ui-eholdings.${messageId}`} />
      </Button>
    );
  } else {
    return null;
  }
}

function messageFor(pkg) {
  if (pkg.isPartiallySelected) {
    return {
      id: 'ui-eholdings.package.partiallySelected',
      values: { selectedCount: pkg.selectedCount, titleCount: pkg.titleCount }
    };
  }
  if (pkg.isSelected) {
    return { id: 'ui-eholdings.selected' };
  } else {
    return { id: 'ui-eholdings.notSelected' };
  }
}
