import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { IfPermission } from '@folio/stripes-core';
import {
  Headline,
  Icon,
  Button,
} from '@folio/stripes/components';

export default function SelectionStatus({ model, onAddToHoldings }) {
  return (
    <div data-test-eholdings-package-details-selected>
      <SelectionStatusMessage model={model} />
      <br />
      <IfPermission perm="ui-eholdings.package-title.select-unselect">
        <SelectionStatusButton
          model={model}
          onAddToHoldings={onAddToHoldings}
        />
      </IfPermission>
    </div>
  );
}
SelectionStatus.propTypes = {
  model: PropTypes.object.isRequired,
  onAddToHoldings: PropTypes.func.isRequired
};

function messageFor(model) {
  if (model.isPartiallySelected) {
    return {
      id: 'ui-eholdings.package.partiallySelected',
      values: { selectedCount: <FormattedNumber value={model.selectedCount} />, titleCount: <FormattedNumber value={model.titleCount} /> }
    };
  }
  if (model.isSelected) {
    return { id: 'ui-eholdings.selected' };
  } else {
    return { id: 'ui-eholdings.notSelected' };
  }
}

function SelectionStatusMessage({ model }) {
  if (model.isInFlight) {
    return <Icon icon="spinner-ellipsis" />;
  } else {
    return <Headline margin="none"><FormattedMessage {...messageFor(model)} /></Headline>;
  }
}

function SelectionStatusButton({ model, onAddToHoldings }) {
  if (model.isPartiallySelected || !model.isSelected || model.isInFlight) {
    const messageId = model.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings';
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
