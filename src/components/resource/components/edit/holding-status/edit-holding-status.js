import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import { noop } from 'lodash';

import {
  Accordion,
  Button,
  Headline,
  Icon,
} from '@folio/stripes/components';

import {
  IfPermission,
} from '@folio/stripes/core';

const propTypes = {
  getSectionHeader: PropTypes.func.isRequired,
  handleSectionToggle: PropTypes.func.isRequired,
  handleToggleResourceHoldings: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  isSelectInFlight: PropTypes.bool,
  model: PropTypes.object.isRequired,
  resourceIsCustom: PropTypes.bool,
  resourceSelected: PropTypes.bool.isRequired,
};

const EditHoldingStatus = ({
  isOpen,
  getSectionHeader,
  handleSectionToggle,
  model,
  resourceIsCustom,
  resourceSelected,
  isSelectInFlight,
  handleToggleResourceHoldings,
}) => {
  const renderToggleSelectionStatusButton = () => {
    if ((!resourceSelected && !isSelectInFlight) || (!model.isSelected && isSelectInFlight)) {
      return (
        <IfPermission perm="ui-eholdings.package-title.execute">
          <Button
            buttonStyle="primary"
            onClick={handleToggleResourceHoldings}
            disabled={isSelectInFlight}
            data-test-eholdings-resource-add-to-holdings-button
            data-testid="resource-add-to-holdings-button"
          >
            <FormattedMessage id="ui-eholdings.addToHoldings" />
          </Button>
        </IfPermission>
      );
    }

    return null;
  };

  const getSelectionStatusMessage = () => {
    return resourceSelected
      ? <FormattedMessage id="ui-eholdings.selected" />
      : <FormattedMessage id="ui-eholdings.notSelected" />;
  };

  return (
    <Accordion
      label={getSectionHeader('ui-eholdings.label.holdingStatus')}
      open={isOpen}
      id="resourceShowHoldingStatus"
      onToggle={handleSectionToggle}
    >
      <label
        data-test-eholdings-resource-holding-status
        htmlFor="managed-resource-holding-status"
      >
        {model.update.isPending ? (
          <Icon icon='spinner-ellipsis' />
        )
          : (
            <Headline margin="none">
              {getSelectionStatusMessage()}
            </Headline>
          )}
        <br />
        {!resourceIsCustom && renderToggleSelectionStatusButton()}
      </label>
    </Accordion>
  );
};

EditHoldingStatus.propTypes = propTypes;

EditHoldingStatus.defaultProps = {
  handleToggleResourceHoldings: noop,
  isSelectInFlight: false,
};

export default EditHoldingStatus;
