import { FormattedMessage } from 'react-intl';

import listTypes from './listTypes';

export const PACKAGE_TITLES_LIST_COLUMNS = {
  STATUS: 'status',
  TITLE: 'title',
  MANAGED_COVERAGE: 'managedCoverage',
  CUSTOM_COVERAGE: 'customCoverage',
  MANAGED_EMBARGO: 'managedEmbargo',
  CUSTOM_EMBARGO: 'customEmbargo',
  PUBLICATION_TYPE: 'publicationType',
  ACCESS_STATUS_TYPE: 'accessStatusType',
  TAGS: 'tags',
};

export const PACKAGE_TITLE_LIST_COLUMN_MAPPING = {
  [PACKAGE_TITLES_LIST_COLUMNS.STATUS]: <FormattedMessage id="ui-eholdings.titlesList.status" />,
  [PACKAGE_TITLES_LIST_COLUMNS.TITLE]: <FormattedMessage id="ui-eholdings.titlesList.title" />,
  [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_COVERAGE]: <FormattedMessage id="ui-eholdings.titlesList.managedCoverage" />,
  [PACKAGE_TITLES_LIST_COLUMNS.CUSTOM_COVERAGE]: <FormattedMessage id="ui-eholdings.titlesList.customCoverage" />,
  [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_EMBARGO]: <FormattedMessage id="ui-eholdings.titlesList.managedEmbargo" />,
  [PACKAGE_TITLES_LIST_COLUMNS.CUSTOM_EMBARGO]: <FormattedMessage id="ui-eholdings.titlesList.customEmbargo" />,
  [PACKAGE_TITLES_LIST_COLUMNS.PUBLICATION_TYPE]: <FormattedMessage id="ui-eholdings.titlesList.publicationType" />,
  [PACKAGE_TITLES_LIST_COLUMNS.ACCESS_STATUS_TYPE]: <FormattedMessage id="ui-eholdings.titlesList.accessStatusType" />,
  [PACKAGE_TITLES_LIST_COLUMNS.TAGS]: <FormattedMessage id="ui-eholdings.titlesList.tags" />,
};

export const PROVIDER_PACKAGES_LIST_COLUMNS = {
  STATUS: 'status',
  SELECTED_COUNT: 'selectedCount',
  TITLES_COUNT: 'titlesCount',
  CONTENT_TYPE: 'contentType',
  CUSTOM_COVERAGE: 'customCoverage',
  PACKAGE_TYPE: 'packageType',
  ACCESS_STATUS_TYPE: 'accessStatusType',
  TAGS: 'tags',
};

export const PROVIDER_PACKAGES_LIST_COLUMN_MAPPING = {
  [PROVIDER_PACKAGES_LIST_COLUMNS.STATUS]: <FormattedMessage id="ui-eholdings.packagesList.status" />,
  [PROVIDER_PACKAGES_LIST_COLUMNS.SELECTED_COUNT]: <FormattedMessage id="ui-eholdings.packagesList.selectedCount" />,
  [PROVIDER_PACKAGES_LIST_COLUMNS.TITLES_COUNT]: <FormattedMessage id="ui-eholdings.packagesList.titlesCount" />,
  [PROVIDER_PACKAGES_LIST_COLUMNS.CONTENT_TYPE]: <FormattedMessage id="ui-eholdings.packagesList.contentType" />,
  [PROVIDER_PACKAGES_LIST_COLUMNS.CUSTOM_COVERAGE]: <FormattedMessage id="ui-eholdings.packagesList.customCoverage" />,
  [PROVIDER_PACKAGES_LIST_COLUMNS.PACKAGE_TYPE]: <FormattedMessage id="ui-eholdings.packagesList.packageType" />,
  [PROVIDER_PACKAGES_LIST_COLUMNS.ACCESS_STATUS_TYPE]: <FormattedMessage id="ui-eholdings.packagesList.accessStatusType" />,
  [PROVIDER_PACKAGES_LIST_COLUMNS.TAGS]: <FormattedMessage id="ui-eholdings.packagesList.tags" />,
};

export const COLUMN_MAPPING_BY_LIST_TYPE = {
  [listTypes.TITLES]: PACKAGE_TITLE_LIST_COLUMN_MAPPING,
  [listTypes.PACKAGES]: PROVIDER_PACKAGES_LIST_COLUMN_MAPPING,
};
