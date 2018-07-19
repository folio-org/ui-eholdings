import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Button } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

export default function SelectionStatus({ model, isPending, onAddToHoldings }) {
  return (
    <label data-test-eholdings-package-details-selected>
      <SelectionStatusMessage isPending={isPending} model={model} />
      <br />
      <SelectionStatusButton
        model={model}
        isPending={isPending}
        onAddToHoldings={onAddToHoldings}
      />
    </label>);
}
SelectionStatus.propTypes = {
  model: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  onAddToHoldings: PropTypes.func.isRequired
};

function SelectionStatusMessage({ model, isPending }) {
  if (isPending) {
    return <Icon icon="spinner-ellipsis" />;
  } else {
    return <h4><FormattedMessage {...messageFor(model)} /></h4>; // eslint-disable-line no-use-before-define
  }
}

function SelectionStatusButton({ model, isPending, onAddToHoldings }) {
  if (model.isPartiallySelected || !model.isSelected || isPending) {
    let messageId = model.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings';
    return (
      <Button
        type="button"
        buttonStyle="primary"
        disabled={isPending}
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
