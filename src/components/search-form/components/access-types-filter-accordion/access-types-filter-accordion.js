import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Icon,
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import SearchByCheckbox from '../search-by-checkbox';
import { accessTypesReduxStateShape } from '../../../../constants';

import styles from './access-types-filter-accordion.css';

const propTypes = {
  accessTypesStoreData: accessTypesReduxStateShape.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  handleStandaloneFilterChange: PropTypes.func.isRequired,
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.string]).isRequired,
  isOpen: PropTypes.bool,
  onStandaloneFilterChange: PropTypes.func.isRequired,
  onStandaloneFilterToggle: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  searchByAccessTypesEnabled: PropTypes.bool.isRequired,
  searchFilter: PropTypes.object,
};

const defaultProps = {
  isOpen: false,
  searchFilter: {},
};

const AccessTypesFilterAccordion = ({
  accessTypesStoreData,
  searchByAccessTypesEnabled,
  searchFilter,
  onStandaloneFilterChange,
  onStandaloneFilterToggle,
  isOpen,
  header,
  dataOptions,
  handleStandaloneFilterChange,
  onToggle,
}) => {
  const {
    'access-type': accessTypes = [],
  } = searchFilter;

  let accessTypesList = [];

  if (accessTypes) {
    accessTypesList = Array.isArray(accessTypes)
      ? accessTypes
      : accessTypes.split(',');
  }

  accessTypesList.sort();

  const accessStatusTypesExist = !!accessTypesStoreData?.items?.data?.length;

  return accessTypesStoreData?.isLoading
    ? <Icon icon="spinner-ellipsis" />
    : accessStatusTypesExist && (
      <div
        data-test-eholdings-access-types-filter
        role="tab"
      >
        <Accordion
          label={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />}
          id="accessTypesFilter"
          separator={false}
          open={isOpen}
          closedByDefault
          header={header}
          displayClearButton={!!accessTypesList.length}
          onClearFilter={() => onStandaloneFilterChange({ 'access-type': undefined })}
          onToggle={onToggle}
          className={styles['search-filter-accordion']}
        >
          <span className="sr-only" id="accessTypesFilter-label">
            <FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />
          </span>
          <SearchByCheckbox
            filterType="access-type"
            isEnabled={searchByAccessTypesEnabled}
            onStandaloneFilterToggle={onStandaloneFilterToggle}
          />
          <FormattedMessage id="ui-eholdings.accessTypes.filter">
            {
              ([label]) => (
                <div data-testid="search-form-access-type-filter">
                  <MultiSelectionFilter
                    id="accessTypeFilterSelect"
                    ariaLabel={label}
                    dataOptions={dataOptions}
                    name="access-type"
                    onChange={handleStandaloneFilterChange}
                    selectedValues={accessTypesList}
                    disabled={!searchByAccessTypesEnabled}
                    aria-labelledby="accessTypesFilter-label"
                  />
                </div>
              )
            }
          </FormattedMessage>
        </Accordion>
      </div>
    );
};

AccessTypesFilterAccordion.propTypes = propTypes;
AccessTypesFilterAccordion.defaultProps = defaultProps;

export default AccessTypesFilterAccordion;
