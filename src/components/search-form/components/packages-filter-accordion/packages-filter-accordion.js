import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

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
    packageIds = [],
  } = activeFilters;
  const label = intl.formatMessage({ id: 'ui-eholdings.packages.filter' });

  const packagesList = Array.isArray(packageIds)
    ? packageIds
    : packageIds.split(',');

  packagesList.sort();

  const itemToString = option => option?.label || '';

  const handleUpdate = (values) => {
    onUpdate({
      ...activeFilters,
      packageIds: values,
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
        displayClearButton={!!packagesList.length}
        onClearFilter={handleUpdate}
      >
        <MultiSelectionFilter
          id="packagesFilterSelect"
          ariaLabel={label}
          dataOptions={dataOptions}
          name="packageIds"
          itemToString={itemToString}
          valueFormatter={({ option }) => option?.label}
          formatter={FacetOptionFormatter}
          onChange={filter => handleUpdate(filter.values)}
          selectedValues={packagesList}
          disabled={disabled || isLoading}
        />
      </Accordion>
    </div>
  );
};

PackagesFilterAccordion.propTypes = propTypes;

export default PackagesFilterAccordion;
