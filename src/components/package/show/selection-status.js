import React from 'react';

import { Icon, Button } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

export default function SelectionStatus({ model, isPending, onAddToHoldings }) {
  return (<label data-test-eholdings-package-details-selected>
          <SelectionStatusMessage isPending={isPending} model={model} />
          <br />
          <SelectionStatusButton
          model={model}
          isPending={isPending}
          onAddToHoldings={onAddToHoldings} />
  </label>);
}

function SelectionStatusMessage({ model, isPending }) {
  if (isPending) {
    return <Icon icon="spinner-ellipsis" />;
  } else
    return <h4><FormattedMessage {...messageFor(model)} /></h4>;
}

function SelectionStatusButton({ model, isPending, onAddToHoldings }) {
  let message = `Add${ model.isPartiallySelected ? ' all ' : ''} to holdings`;
  if (model.isPartiallySelected || !model.isSelected || isPending) {
    return <Button
      type="button"
      buttonStyle="primary"
      disabled={isPending}
      onClick={onAddToHoldings}
      data-test-eholdings-package-add-to-holdings-button
      > {message}
    </Button>;
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
    return { id: 'ui-eholdings.notSelected'};
  }
}
