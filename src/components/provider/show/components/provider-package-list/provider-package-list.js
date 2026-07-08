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

import SelectedLabel from '../../../../selected-label';
import InternalLink from '../../../../internal-link';
import CoverageDateList from '../../../../coverage-date-list';
import {
  PROVIDER_PACKAGES_LIST_COLUMN_MAPPING,
  PROVIDER_PACKAGES_LIST_COLUMNS,
} from '../../../../../constants/list-columns';
import { isBookPublicationType } from '../../../../utilities';

import styles from './provider-package-list.css';
import { useProviderPackages } from './use-provider-packages';

const MAX_HEIGHT = 520;

const propTypes = {
  count: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  isPackagesUpdating: PropTypes.bool,
  onFetchPackages: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalResults: PropTypes.number.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ProviderPackageList = ({
  // records,
  // isLoading,
  // totalResults,
  // page,
  // count,
  // onFetchPackages,
  // isPackagesUpdating,
  providerId,
  visibleColumns,
}) => {
  const intl = useIntl();

  const {
    providerPackages,
    totalResults,
    isLoading: isPackagesLoading,
  } = useProviderPackages({ providerId });

  const formatCellStyles = defaultClass => classNames(defaultClass, styles.cellTopAlign);
  const formatHeaderCellStyles = () => styles.headerCell;

  const handleMore = (askAmount, index, firstIndex, direction) => {
    // const newPage = direction === 'next' ? page + 1 : page - 1;
    // onFetchPackages(newPage);
  };

  const formatter = {
    [PROVIDER_PACKAGES_LIST_COLUMNS.STATUS]: item => {
      return (
        <div className={styles.statusCellWrapper}>
          <SelectedLabel isSelected={item.attributes.isSelected} />
          {item.attributes.visibilityData?.isHidden && (
            <Tooltip text={intl.formatMessage({ id: 'ui-eholdings.titlesList.hidden' })}>
              {({ ref, ariaIds }) => <Icon icon="eye-closed" ref={ref} aria-labelledby={ariaIds.text} />}
            </Tooltip>
          )}
        </div>
      );
    },
    [PROVIDER_PACKAGES_LIST_COLUMNS.PACKAGE_NAME]: item => {
      return (
        <TextLink element="span">
          {({ className }) => (
            <InternalLink
              to={`/eholdings/providers/${providerId}/${item.id}`}
              className={className}
            >
              {item.attributes.name}
            </InternalLink>
          )}
        </TextLink>
      );
    },
    [PROVIDER_PACKAGES_LIST_COLUMNS.SELECTED_COUNT]: item => item.attributes.selecedCount,
    [PROVIDER_PACKAGES_LIST_COLUMNS.TITLES_COUNT]: item => item.attributes.titleCount,
    [PROVIDER_PACKAGES_LIST_COLUMNS.CONTENT_TYPE]: item => item.attributes.contentType,
    [PROVIDER_PACKAGES_LIST_COLUMNS.CUSTOM_COVERAGE]: item => {
      return (
        <CoverageDateList coverageArray={[item.attributes.customCoverage]} />
      );
    },
    [PROVIDER_PACKAGES_LIST_COLUMNS.PACKAGE_TYPE]: item => item.attributes.packageType,
    [PROVIDER_PACKAGES_LIST_COLUMNS.TAGS]: item => {
      const { tagList } = item.attributes.tags;

      return tagList.join(', ');
    },
  };

  const columnWidths = useMemo(() => ({
    [PROVIDER_PACKAGES_LIST_COLUMNS.STATUS]: '11%',
    [PROVIDER_PACKAGES_LIST_COLUMNS.PACKAGE_NAME]: '25%',
    [PROVIDER_PACKAGES_LIST_COLUMNS.SELECTED_COUNT]: '10%',
    [PROVIDER_PACKAGES_LIST_COLUMNS.TITLES_COUNT]: '10%',
    [PROVIDER_PACKAGES_LIST_COLUMNS.CONTENT_TYPE]: '15%',
    [PROVIDER_PACKAGES_LIST_COLUMNS.CUSTOM_COVERAGE]: '17%',
    [PROVIDER_PACKAGES_LIST_COLUMNS.PACKAGE_TYPE]: '12%',
    [PROVIDER_PACKAGES_LIST_COLUMNS.TAGS]: '12%',
  }), []);

  return (
    <div className={styles.packagesListContainer}>
      {isPackagesLoading
        ? <Icon icon="spinner-ellipsis" width="35px" />
        : (
          <MultiColumnList
            id="provider-package-list"
            maxHeight={MAX_HEIGHT}
            contentData={providerPackages}
            visibleColumns={visibleColumns}
            columnMapping={PROVIDER_PACKAGES_LIST_COLUMN_MAPPING}
            columnWidths={columnWidths}
            formatter={formatter}
            isEmptyMessage={intl.formatMessage({ id: 'ui-eholdings.notFound' })}
            loading={isPackagesLoading}
            totalCount={totalResults}
            onNeedMoreData={handleMore}
            pageAmount={100} // TODO: do I need to pass this?
            pagingType={MCLPagingTypes.PREV_NEXT}
            pagingOffset={100 * (1 - 1)} // TODO: do I need to pass this?
            getCellClass={formatCellStyles}
            getHeaderCellClass={formatHeaderCellStyles}
          />
        )}
    </div>
  );
};

ProviderPackageList.propTypes = propTypes;

export { ProviderPackageList };
