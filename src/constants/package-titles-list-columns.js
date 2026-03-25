import { FormattedMessage } from 'react-intl';

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

// export const PACKAGE_TITLES_LIST_TOGGLEABLE_COLUMNS = [
//   [PACKAGE_TITLES_LIST_COLUMNS.STATUS],
//   [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_COVERAGE],
//   [PACKAGE_TITLES_LIST_COLUMNS.CUSTOM_COVERAGE],
//   [PACKAGE_TITLES_LIST_COLUMNS.MANAGED_EMBARGO],
//   [PACKAGE_TITLES_LIST_COLUMNS.CUSTOM_EMBARGO],
//   [PACKAGE_TITLES_LIST_COLUMNS.PUBLICATION_TYPE],
//   [PACKAGE_TITLES_LIST_COLUMNS.ACCESS_STATUS_TYPE],
//   [PACKAGE_TITLES_LIST_COLUMNS.TAGS],
// ];

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
