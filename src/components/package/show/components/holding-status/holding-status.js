import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Headline,
} from '@folio/stripes/components';

import SelectionStatus from '../../../selection-status';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onAddToHoldings: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const HoldingStatus = ({
  isOpen,
  onToggle,
  onAddToHoldings,
  model,
}) => (
  <Accordion
    label={(
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.label.holdingStatus" />
      </Headline>
    )}
    open={isOpen}
    id="packageHoldingStatus"
    onToggle={onToggle}
  >
    <SelectionStatus
      model={model}
      onAddToHoldings={onAddToHoldings}
    />
  </Accordion>
);

HoldingStatus.propTypes = propTypes;

export default HoldingStatus;
