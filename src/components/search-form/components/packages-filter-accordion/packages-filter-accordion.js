import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';

import FacetOptionFormatter from '../../../facet-option-formatter';

import styles from '../../search-form.css';

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
    packageIds: packageId,
  } = activeFilters;
  const label = intl.formatMessage({ id: 'ui-eholdings.packages.filter' });

  const handleUpdate = (selectedPackageId) => {
    onUpdate({
      ...activeFilters,
      packageIds: selectedPackageId,
    });
  };

  const handleListFiltering = (value, options) => {
    return options.filter(option => option.label.toLowerCase().startsWith(value.toLowerCase()));
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
        displayClearButton={!!packageId}
        onClearFilter={handleUpdate}
        className={styles['search-filter-accordion']}
      >
        <Selection
          id="packagesFilterSelect"
          name="packageIds"
          value={packageId}
          formatter={FacetOptionFormatter}
          dataOptions={dataOptions}
          onChange={handleUpdate}
          onFilter={handleListFiltering}
          aria-label={label}
          disabled={disabled || isLoading}
        />
      </Accordion>
    </div>
  );
};

PackagesFilterAccordion.propTypes = propTypes;

export default PackagesFilterAccordion;
