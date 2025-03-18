import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Icon,
} from '@folio/stripes/components';

import { AccessTypesFilter } from '../../../access-type-filter';
import { getAccessTypesList } from '../../../utilities';
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

const AccessTypesFilterAccordion = ({
  accessTypesStoreData,
  searchByAccessTypesEnabled,
  searchFilter = {},
  onStandaloneFilterChange,
  onStandaloneFilterToggle,
  isOpen = false,
  header,
  dataOptions,
  handleStandaloneFilterChange,
  onToggle,
}) => {
  const {
    'access-type': accessTypes = [],
  } = searchFilter;

  const accessStatusTypesExist = !!accessTypesStoreData?.items?.data?.length;
  const accessTypesList = getAccessTypesList(accessTypes);

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
          <AccessTypesFilter
            accessTypesStoreData={accessTypesStoreData}
            searchByAccessTypesEnabled={searchByAccessTypesEnabled}
            selectedValues={accessTypesList}
            onStandaloneFilterChange={onStandaloneFilterChange}
            onStandaloneFilterToggle={onStandaloneFilterToggle}
            dataOptions={dataOptions}
            handleStandaloneFilterChange={handleStandaloneFilterChange}
          />
        </Accordion>
      </div>
    );
};

AccessTypesFilterAccordion.propTypes = propTypes;

export default AccessTypesFilterAccordion;
