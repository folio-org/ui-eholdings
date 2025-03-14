import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  MCLPagingTypes,
  MultiColumnList,
  TextLink,
} from '@folio/stripes/components';

import SelectedLabel from '../../../../selected-label';
import InternalLink from '../../../../internal-link';
import CoverageDateList from '../../../../coverage-date-list';
import { isBookPublicationType } from '../../../../utilities';

import styles from './PackageTitleList.css';

const COLUMNS = {
  STATUS: 'status',
  TITLE: 'title',
  MANAGED_COVERAGE: 'managedCoverage',
  CUSTOM_COVERAGE: 'customCoverage',
  MANAGED_EMBARGO: 'managedEmbargo',
};

const MAX_HEIGHT = 520;

const propTypes = {
  count: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  onFetchPackageTitles: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalResults: PropTypes.number.isRequired,
};

const PackageTitleList = ({
  records,
  isLoading,
  totalResults,
  page,
  count,
  onFetchPackageTitles,
}) => {
  const intl = useIntl();

  const columnMappings = {
    [COLUMNS.STATUS]: intl.formatMessage({ id: 'ui-eholdings.titlesList.status' }),
    [COLUMNS.TITLE]: intl.formatMessage({ id: 'ui-eholdings.titlesList.title' }),
    [COLUMNS.MANAGED_COVERAGE]: intl.formatMessage({ id: 'ui-eholdings.titlesList.managedCoverage' }),
    [COLUMNS.CUSTOM_COVERAGE]: intl.formatMessage({ id: 'ui-eholdings.titlesList.customCoverage' }),
    [COLUMNS.MANAGED_EMBARGO]: intl.formatMessage({ id: 'ui-eholdings.titlesList.managedEmbargo' }),
  };

  const handleMore = (askAmount, index, firstIndex, direction) => {
    const newPage = direction === 'next' ? page + 1 : page - 1;
    onFetchPackageTitles(newPage);
  };

  const formatter = {
    [COLUMNS.STATUS]: item => {
      return (
        <SelectedLabel isSelected={item.attributes.isSelected} />
      );
    },
    [COLUMNS.TITLE]: item => {
      return (
        <TextLink element="span">
          {({ className }) => (
            <InternalLink
              to={`/eholdings/resources/${item.id}`}
              className={className}
            >
              {item.attributes.name}
            </InternalLink>
          )}
        </TextLink>
      );
    },
    [COLUMNS.MANAGED_COVERAGE]: item => {
      return (
        <CoverageDateList
          isManagedCoverage
          coverageArray={item.attributes.managedCoverages}
          isYearOnly={isBookPublicationType(item.attributes.publicationType)}
        />
      );
    },
    [COLUMNS.CUSTOM_COVERAGE]: item => {
      return (
        <CoverageDateList
          coverageArray={item.attributes.customCoverages}
          isYearOnly={isBookPublicationType(item.attributes.publicationType)}
        />
      );
    },
    [COLUMNS.MANAGED_EMBARGO]: item => {
      const { embargoUnit, embargoValue } = item.attributes.managedEmbargoPeriod || {};

      if (!embargoUnit || !embargoValue) {
        return null;
      }

      return intl.formatMessage({ id: `ui-eholdings.resource.embargoUnit.${embargoUnit}` }, {
        value: embargoValue,
      });
    },
  };

  return (
    <div className={styles.titlesListContainer}>
      <MultiColumnList
        id="package-title-list"
        maxHeight={MAX_HEIGHT}
        contentData={records}
        visibleColumns={Object.values(COLUMNS)}
        columnMapping={columnMappings}
        formatter={formatter}
        isEmptyMessage={intl.formatMessage({ id: 'ui-eholdings.notFound' })}
        loading={isLoading}
        hasMargin
        totalCount={totalResults}
        onNeedMoreData={handleMore}
        pageAmount={count}
        pagingType={MCLPagingTypes.PREV_NEXT}
        pagingOffset={count * (page - 1)}
      />
    </div>
  );
};

PackageTitleList.propTypes = propTypes;

export { PackageTitleList };
