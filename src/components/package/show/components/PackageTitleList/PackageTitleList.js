import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Icon,
  MCLPagingTypes,
  MultiColumnList,
  TextLink,
  Tooltip,
} from '@folio/stripes/components';
import { useColumnManager } from '@folio/stripes/smart-components';

import SelectedLabel from '../../../../selected-label';
import InternalLink from '../../../../internal-link';
import CoverageDateList from '../../../../coverage-date-list';
import {
  PACKAGE_TITLE_LIST_COLUMN_MAPPING,
  PACKAGE_TITLES_LIST_COLUMNS,
} from '../../../../../constants/package-titles-list-columns';
import { isBookPublicationType } from '../../../../utilities';

import styles from './PackageTitleList.css';

const MAX_HEIGHT = 520;

const propTypes = {
  count: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  isTitlesUpdating: PropTypes.bool,
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
  isTitlesUpdating,
}) => {
  const intl = useIntl();

  const { visibleColumns } = useColumnManager('eholdings-titles', PACKAGE_TITLE_LIST_COLUMN_MAPPING);

  const formatCellStyles = defaultClass => classNames(defaultClass, styles.cellTopAlign);
  const formatHeaderCellStyles = () => styles.headerCell;

  const handleMore = (askAmount, index, firstIndex, direction) => {
    const newPage = direction === 'next' ? page + 1 : page - 1;
    onFetchPackageTitles(newPage);
  };

  const formatter = {
    [PACKAGE_TITLES_LIST_COLUMNS.STATUS]: item => {
      return (
        <div className={styles.statusCellWrapper}>
          <SelectedLabel isSelected={item.attributes.isSelected} />
          {item.attributes.visibilityData?.isHidden && (
            <Tooltip
              text={intl.formatMessage({ id: 'ui-eholdings.titlesList.hidden' })}
              id="resource-hidden-tooltip"
            >
              {({ ref, ariaIds }) => <Icon icon="eye-closed" ref={ref} aria-labelledby={ariaIds.text} />}
            </Tooltip>
          )}
        </div>
      );
    },
    [PACKAGE_TITLES_LIST_COLUMNS.TITLE]: item => {
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
    [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_COVERAGE]: item => {
      return (
        <CoverageDateList
          isManagedCoverage
          coverageArray={item.attributes.managedCoverages}
          isYearOnly={isBookPublicationType(item.attributes.publicationType)}
        />
      );
    },
    [PACKAGE_TITLES_LIST_COLUMNS.CUSTOM_COVERAGE]: item => {
      return (
        <CoverageDateList
          coverageArray={item.attributes.customCoverages}
          isYearOnly={isBookPublicationType(item.attributes.publicationType)}
        />
      );
    },
    [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_EMBARGO]: item => {
      const { embargoUnit, embargoValue } = item.attributes.managedEmbargoPeriod || {};

      if (!embargoUnit || !embargoValue) {
        return null;
      }

      return intl.formatMessage({ id: `ui-eholdings.resource.embargoUnit.${embargoUnit}` }, {
        value: embargoValue,
      });
    },
    [PACKAGE_TITLES_LIST_COLUMNS.CUSTOM_EMBARGO]: item => {
      const { embargoUnit, embargoValue } = item.attributes.customEmbargoPeriod || {};

      if (!embargoUnit || !embargoValue) {
        return null;
      }

      return intl.formatMessage({ id: `ui-eholdings.resource.embargoUnit.${embargoUnit}` }, {
        value: embargoValue,
      });
    },
    [PACKAGE_TITLES_LIST_COLUMNS.PUBLICATION_TYPE]: item => item.publicationType,
    [PACKAGE_TITLES_LIST_COLUMNS.ACCESS_STATUS_TYPE]: item => item.included.find(included => included.type === 'accessTypes')?.attributes?.name,
    [PACKAGE_TITLES_LIST_COLUMNS.TAGS]: item => {
      const { tagList } = item.attributes.tags;

      return tagList.join(', ');
    },
  };

  const columnWidths = useMemo(() => ({
    [PACKAGE_TITLES_LIST_COLUMNS.STATUS]: '11%',
    [PACKAGE_TITLES_LIST_COLUMNS.TITLE]: '25%',
    [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_COVERAGE]: '16%',
    [PACKAGE_TITLES_LIST_COLUMNS.CUSTOM_COVERAGE]: '17%',
    [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_EMBARGO]: '17%',
    [PACKAGE_TITLES_LIST_COLUMNS.TAGS]: '12%',
  }), []);

  return (
    <div className={styles.titlesListContainer}>
      {isTitlesUpdating
        ? <Icon icon="spinner-ellipsis" width="35px" />
        : (
          <MultiColumnList
            id="package-title-list"
            maxHeight={MAX_HEIGHT}
            contentData={records}
            visibleColumns={visibleColumns}
            columnMapping={PACKAGE_TITLE_LIST_COLUMN_MAPPING}
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
        )}
    </div>
  );
};

PackageTitleList.propTypes = propTypes;

export { PackageTitleList };
