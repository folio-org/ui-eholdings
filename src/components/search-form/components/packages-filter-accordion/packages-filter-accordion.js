import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';

import FacetOptionFormatter from '../../../facet-option-formatter';

const propTypes = {
  activeFilters: PropTypes.object.isRequired,
  dataOptions: PropTypes.array.isRequired,
  disabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

const PackagesFilterAccordion = ({
  activeFilters,
  dataOptions,
  disabled,
  isLoading,
  onUpdate,
}) => {
  const intl = useIntl();
  const {
    packageIds,
  } = activeFilters;
  const label = intl.formatMessage({ id: 'ui-eholdings.packages.filter' });

  const handleUpdate = (packageId) => {
    onUpdate({
      ...activeFilters,
      packageIds: packageId,
    });
  };

  return (
    <div
      role="tab"
      data-testid="packagesFilter"
    >
      <Accordion
        label={label}
        id="packagesFilter"
        separator={false}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={!!packageIds}
        onClearFilter={handleUpdate}
      >
        <Selection
          id="packagesFilterSelect"
          name="packageIds"
          value={packageIds}
          formatter={FacetOptionFormatter}
          dataOptions={dataOptions}
          onChange={handleUpdate}
          aria-label={label}
          disabled={disabled || isLoading}
        />
      </Accordion>
    </div>
  );
};

PackagesFilterAccordion.propTypes = propTypes;

export default PackagesFilterAccordion;
