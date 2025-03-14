import { useRef } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { SearchByCheckbox } from '../search-by-checkbox';
import { ClearButton } from '../clear-button';
import { accessTypesReduxStateShape } from '../../constants';

import styles from './access-type-filter.css';

const propTypes = {
  accessTypesStoreData: accessTypesReduxStateShape.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  handleStandaloneFilterChange: PropTypes.func.isRequired,
  onStandaloneFilterChange: PropTypes.func.isRequired,
  onStandaloneFilterToggle: PropTypes.func.isRequired,
  searchByAccessTypesEnabled: PropTypes.bool.isRequired,
  selectedValues: PropTypes.array.isRequired,
  showClearButton: PropTypes.bool,
};

const AccessTypesFilter = ({
  accessTypesStoreData,
  searchByAccessTypesEnabled,
  selectedValues,
  onStandaloneFilterChange,
  onStandaloneFilterToggle,
  dataOptions,
  handleStandaloneFilterChange,
  showClearButton = false,
}) => {
  const intl = useIntl();
  const labelRef = useRef(null);

  const accessStatusTypesExist = !!accessTypesStoreData?.items?.data?.length;
  const accessTypeFilterLabel = intl.formatMessage({ id: 'ui-eholdings.accessTypes.filter' });

  const handleClearButtonClick = () => {
    onStandaloneFilterChange({ 'access-type': undefined });
    labelRef.current?.focus();
  };

  if (accessTypesStoreData?.isLoading) {
    return <Icon icon="spinner-ellipsis" />;
  }

  if (!accessStatusTypesExist) {
    return null;
  }

  return (
    <>
      <div className={styles.headline}>
        <span
          className="sr-only"
          id="accessTypesFilter-label"
        >
          {intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes' })}
        </span>
        <SearchByCheckbox
          ref={labelRef}
          filterType="access-type"
          isEnabled={searchByAccessTypesEnabled}
          onStandaloneFilterToggle={onStandaloneFilterToggle}
        />
        {showClearButton && (
          <ClearButton
            show={selectedValues.length > 0}
            label={accessTypeFilterLabel}
            onClick={handleClearButtonClick}
          />
        )}
      </div>
      <div data-testid="search-form-access-type-filter">
        <MultiSelectionFilter
          id="accessTypeFilterSelect"
          ariaLabel={accessTypeFilterLabel}
          dataOptions={dataOptions}
          name="access-type"
          onChange={handleStandaloneFilterChange}
          selectedValues={selectedValues}
          disabled={!searchByAccessTypesEnabled}
          aria-labelledby="accessTypesFilter-label"
        />
      </div>
    </>
  );
};

AccessTypesFilter.propTypes = propTypes;

export { AccessTypesFilter };
