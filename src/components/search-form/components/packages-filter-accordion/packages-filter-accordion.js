import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  Icon,
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
  const {
    packageIds = [],
  } = activeFilters;

  const packagesList = Array.isArray(packageIds)
    ? packageIds
    : packageIds.split(',');

  packagesList.sort();

  const itemToString = option => option?.label || '';

  return (
    <div
      role="tab"
      data-testid="packagesFilter"
    >
      <FormattedMessage id="ui-eholdings.packages.filter">
        {([label]) => (
          <Accordion
            label={label}
            id="packagesFilter"
            separator={false}
            closedByDefault
            header={FilterAccordionHeader}
            displayClearButton={!!packagesList.length}
            onClearFilter={() => onUpdate({ packageIds: undefined })}
          >
            {isLoading && !disabled
              ? <Icon icon="spinner-ellipsis" />
              : (
                <MultiSelectionFilter
                  id="packagesFilterSelect"
                  ariaLabel={label}
                  dataOptions={dataOptions}
                  name="packageIds"
                  itemToString={itemToString}
                  valueFormatter={({ option }) => option?.label}
                  formatter={FacetOptionFormatter}
                  onChange={filter => onUpdate({ packageIds: filter.values })}
                  selectedValues={packagesList}
                  disabled={disabled}
                />
              )
            }
          </Accordion>
        )}
      </FormattedMessage>
    </div>
  );
};

PackagesFilterAccordion.propTypes = propTypes;

export default PackagesFilterAccordion;
