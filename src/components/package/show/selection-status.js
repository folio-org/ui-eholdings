import React from 'react';

import { Icon, Button } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

export default function SelectionStatus({ model, isPending, isSelectedInParentComponentState, onAddToHoldings }) {
  let packageSelectionPending = isPending;
  let packageSelected = isSelectedInParentComponentState;
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
  let packageSelectionPending = isPending;
  if (!model.isSelected || packageSelectionPending) {
    return <Button
        type="button"
        buttonStyle="primary"
        disabled={packageSelectionPending}
        onClick={onAddToHoldings}
        data-test-eholdings-package-add-to-holdings-button
      >
        Add to holdings
    </Button>;
  } else {
    return null;
  }
}


function messageFor(model) {
  if (model.isSelected) {
    return { id: "ui-eholdings.selected" };
  } else {
    return { id: "ui-eholdings.notSelected" };
  }
}
