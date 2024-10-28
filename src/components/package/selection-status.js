import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Headline,
  Icon,
  Button,
} from '@folio/stripes/components';

import SelectionStatusStyles from './selection-status.css';

const SelectionStatus = ({
  model,
  onAddToHoldings,
}) => {
  return (
    <div
      data-test-eholdings-package-details-selected
      data-testid="package-selection-status"
    >
      <SelectionStatusMessage model={model} />
      <br />
      <IfPermission perm="ui-eholdings.package-title.select-unselect.execute">
        <SelectionStatusButton
          model={model}
          onAddToHoldings={onAddToHoldings}
        />
      </IfPermission>
    </div>
  );
};

SelectionStatus.propTypes = {
  model: PropTypes.object.isRequired,
  onAddToHoldings: PropTypes.func.isRequired,
};

const messageFor = model => {
  if (model.isPartiallySelected) {
    return {
      id: 'ui-eholdings.package.partiallySelected',
      values: {
        selectedCount: <FormattedNumber value={model.selectedCount} />,
        titleCount: <FormattedNumber value={model.titleCount} />,
      },
    };
  }
  if (model.isSelected) {
    return { id: 'ui-eholdings.selected' };
  } else {
    return { id: 'ui-eholdings.notSelected' };
  }
};

const SelectionStatusMessage = ({ model }) => {
  if (model.isInFlight) {
    return <Icon icon="spinner-ellipsis" />;
  } else {
    return (
      <Headline
        margin="none"
        data-testid="selection-status-message"
        className={SelectionStatusStyles.label}
      >
        <FormattedMessage {...messageFor(model)} />
      </Headline>
    );
  }
};

SelectionStatusMessage.propTypes = {
  model: PropTypes.object.isRequired,
};


const SelectionStatusButton = ({
  model,
  onAddToHoldings,
}) => {
  if (model.isPartiallySelected || !model.isSelected || model.isInFlight) {
    const messageId = model.isPartiallySelected
      ? 'addAllToHoldings'
      : 'addPackageToHoldings';

    return (
      <Button
        type="button"
        buttonStyle="primary"
        disabled={model.isInFlight}
        onClick={onAddToHoldings}
        data-test-eholdings-package-add-to-holdings-button
        data-testid="add-to-holdings-button"
      >
        <FormattedMessage id={`ui-eholdings.${messageId}`} />
      </Button>
    );
  } else {
    return null;
  }
};

SelectionStatusButton.propTypes = {
  model: PropTypes.object.isRequired,
  onAddToHoldings: PropTypes.func.isRequired,
};

export default SelectionStatus;
