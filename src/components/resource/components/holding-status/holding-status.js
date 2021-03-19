import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  IfPermission,
} from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Headline,
  Icon,
} from '@folio/stripes/components';

import {
  PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION,
} from '../../../../constants';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onAddToHoldings: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  resourceSelected: PropTypes.bool.isRequired,
};

const HoldingStatus = ({
  isOpen,
  onToggle,
  resourceSelected,
  model,
  onAddToHoldings,
}) => {
  const isSelectInFlight = model.update.isPending && 'isSelected' in model.update.changedAttributes;

  const addToEholdingsButtonIsAvailable = (!resourceSelected && !isSelectInFlight)
    || (!model.isSelected && isSelectInFlight);

  return (
    <Accordion
      label={(
        <Headline size="large" tag="h3">
          <FormattedMessage id="ui-eholdings.label.holdingStatus" />
        </Headline>
      )}
      open={isOpen}
      id="resourceShowHoldingStatus"
      onToggle={onToggle}
    >
      <label
        data-test-eholdings-resource-show-selected
        htmlFor="resource-show-toggle-switch"
      >
        {
          model.update.isPending
            ? (
              <Icon
                icon="spinner-ellipsis"
                data-testid="spinner"
              />
            )
            : (
              <Headline margin="none">
                {
                  resourceSelected
                    ? (
                      <FormattedMessage id="ui-eholdings.selected" />
                    )
                    : (
                      <FormattedMessage id="ui-eholdings.notSelected" />
                    )
                }
              </Headline>
            )
        }
        <br />
        {
          addToEholdingsButtonIsAvailable && (
            <IfPermission perm={PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION}>
              <Button
                buttonStyle="primary"
                onClick={onAddToHoldings}
                disabled={model.destroy.isPending || isSelectInFlight}
                data-test-eholdings-resource-add-to-holdings-button
                data-testid="resource-add-to-holdings-button"
              >
                <FormattedMessage id="ui-eholdings.addToHoldings" />
              </Button>
            </IfPermission>
          )
        }
      </label>
    </Accordion>
  );
};

HoldingStatus.propTypes = propTypes;

export default HoldingStatus;
