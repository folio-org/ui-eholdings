import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  TAGS: 'tags',
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
    [COLUMNS.TAGS]: intl.formatMessage({ id: 'ui-eholdings.titlesList.tags' }),
  };

  const formatCellStyles = defaultClass => classNames(defaultClass, styles.cellTopAlign);
  const formatHeaderCellStyles = () => styles.headerCell;

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
    [COLUMNS.TAGS]: item => {
      const { tagList } = item.attributes.tags;

      return tagList.join(', ');
    },
  };

  const columnWidths = useMemo(() => ({
    [COLUMNS.STATUS]: '11%',
    [COLUMNS.TITLE]: '25%',
    [COLUMNS.MANAGED_COVERAGE]: '16%',
    [COLUMNS.CUSTOM_COVERAGE]: '16%',
    [COLUMNS.MANAGED_EMBARGO]: '17%',
    [COLUMNS.TAGS]: '13%',
  }), []);

  return (
    <div className={styles.titlesListContainer}>
      <MultiColumnList
        id="package-title-list"
        maxHeight={MAX_HEIGHT}
        contentData={records}
        visibleColumns={Object.values(COLUMNS)}
        columnMapping={columnMappings}
        columnWidths={columnWidths}
        formatter={formatter}
        isEmptyMessage={intl.formatMessage({ id: 'ui-eholdings.notFound' })}
        loading={isLoading}
        totalCount={totalResults}
        onNeedMoreData={handleMore}
        pageAmount={count}
        pagingType={MCLPagingTypes.PREV_NEXT}
        pagingOffset={count * (page - 1)}
        getCellClass={formatCellStyles}
        getHeaderCellClass={formatHeaderCellStyles}
      />
    </div>
  );
};

PackageTitleList.propTypes = propTypes;

export { PackageTitleList };
