import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Button } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

export default function SelectionStatus({ model, onAddToHoldings }) {
  return (
    <label data-test-eholdings-package-details-selected>
      <SelectionStatusMessage model={model} />
      <br />
      <SelectionStatusButton
        model={model}
        onAddToHoldings={onAddToHoldings}
      />
    </label>);
}
SelectionStatus.propTypes = {
  model: PropTypes.object.isRequired,
  onAddToHoldings: PropTypes.func.isRequired
};

function SelectionStatusMessage({ model }) {
  if (model.isInFlight) {
    return <Icon icon="spinner-ellipsis" />;
  } else {
    return <h4><FormattedMessage {...messageFor(model)} /></h4>; // eslint-disable-line no-use-before-define
  }
}

function SelectionStatusButton({ model, onAddToHoldings }) {
  if (model.isPartiallySelected || !model.isSelected || model.isInFlight) {
    let messageId = model.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings';
    return (
      <Button
        type="button"
        buttonStyle="primary"
        disabled={model.isInFlight}
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


function messageFor(model) {
  if (model.isPartiallySelected) {
    return {
      id: 'ui-eholdings.package.partiallySelected',
      values: { selectedCount: model.selectedCount, titleCount: model.titleCount }
    };
  }
  if (model.isSelected) {
    return { id: 'ui-eholdings.selected' };
  } else {
    return { id: 'ui-eholdings.notSelected' };
  }
}
