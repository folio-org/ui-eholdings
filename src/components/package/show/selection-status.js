import React from 'react';

import { Icon, Button } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

export default function SelectionStatus({ model, isPending, isSelectedInParentComponentState, onAddToHoldings }) {
  let packageSelectionPending = isPending;
  let packageSelected = isSelectedInParentComponentState;
  return (<label data-test-eholdings-package-details-selected>
          { packageSelectionPending ? (
            <Icon icon="spinner-ellipsis" />
          ) : (
            <h4>{packageSelected ?
                 (<FormattedMessage id="ui-eholdings.selected" />)
                 :
                 (<FormattedMessage id="ui-eholdings.notSelected" />)}
            </h4>
          ) }

          <br />
          {(
            (!packageSelected && !packageSelectionPending) ||
              (!model.isSelected && packageSelectionPending)) &&
           <Button
           type="button"
           buttonStyle="primary"
           disabled={packageSelectionPending}
           onClick={onAddToHoldings}
           data-test-eholdings-package-add-to-holdings-button
           >
           Add to holdings
           </Button>
          }
  </label>);
}
