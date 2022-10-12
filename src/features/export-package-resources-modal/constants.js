/* eslint-disable import/prefer-default-export */

export const FIELD_SECTION_RADIOS = {
  ALL: 'all',
  SELECT: 'select',
};

export const RECORD_TYPES = {
  PACKAGE: 'package',
  RESOURCE: 'resource',
};

const RESOURCE_EXPORT_FIELDS = [
  {
    value: 'titleName',
    label: 'ui-eholdings.exportPackageResources.fields.title.titleName'
  },
  {
    value: 'alternateTitles',
    label: 'ui-eholdings.exportPackageResources.fields.title.alternateTitles'
  },
  {
    value: 'titleId',
    label: 'ui-eholdings.exportPackageResources.fields.title.titleId'
  },
  {
    value: 'publicationType',
    label: 'ui-eholdings.exportPackageResources.fields.title.publicationType'
  },
  {
    value: 'titleType',
    label: 'ui-eholdings.exportPackageResources.fields.title.titleType'
  },
  {
    value: 'titleHoldingsStatus',
    label: 'ui-eholdings.exportPackageResources.fields.title.holdingStatus'
  },
  {
    value: 'titleShowToPatrons',
    label: 'ui-eholdings.exportPackageResources.fields.title.showToPatron'
  },
  {
    value: 'managedCoverage',
    label: 'ui-eholdings.exportPackageResources.fields.title.managedCoverageDates'
  },
  {
    value: 'managedEmbargo',
    label: 'ui-eholdings.exportPackageResources.fields.title.managedEmbargo'
  },
  {
    value: 'customCoverage',
    label: 'ui-eholdings.exportPackageResources.fields.title.customCoverageDates'
  },
  {
    value: 'customEmbargo',
    label: 'ui-eholdings.exportPackageResources.fields.title.customEmbargo'
  },
  {
    value: 'coverageStatement',
    label: 'ui-eholdings.exportPackageResources.fields.title.coverageStatement'
  },
  {
    value: 'titleProxy',
    label: 'ui-eholdings.exportPackageResources.fields.title.proxy'
  },
  {
    value: 'url',
    label: 'ui-eholdings.exportPackageResources.fields.title.url'
  },
  {
    value: 'titleAccessStatusType',
    label: 'ui-eholdings.exportPackageResources.fields.title.accessStatusType'
  },
  {
    value: 'titleTags',
    label: 'ui-eholdings.exportPackageResources.fields.title.tags'
  },
  {
    value: 'contributors',
    label: 'ui-eholdings.exportPackageResources.fields.title.contributors'
  },
  {
    value: 'edition',
    label: 'ui-eholdings.exportPackageResources.fields.title.edition'
  },
  {
    value: 'publisher',
    label: 'ui-eholdings.exportPackageResources.fields.title.publisher'
  },
  {
    value: 'ISSNPrint',
    label: 'ui-eholdings.exportPackageResources.fields.title.issn_print'
  },
  {
    value: 'ISSNOnline',
    label: 'ui-eholdings.exportPackageResources.fields.title.issn_online'
  },
  {
    value: 'ISBNPrint',
    label: 'ui-eholdings.exportPackageResources.fields.title.isbn_print'
  },
  {
    value: 'ISBNOnline',
    label: 'ui-eholdings.exportPackageResources.fields.title.isbn_online'
  },
  {
    value: 'subjects',
    label: 'ui-eholdings.exportPackageResources.fields.title.subjects'
  },
  {
    value: 'peerReviewed',
    label: 'ui-eholdings.exportPackageResources.fields.title.peerReviewed'
  },
  {
    value: 'description',
    label: 'ui-eholdings.exportPackageResources.fields.title.description'
  },
  {
    value: 'customLabel',
    label: 'ui-eholdings.exportPackageResources.fields.title.customLabel'
  },
  {
    value: 'titleAgreements',
    label: 'ui-eholdings.exportPackageResources.fields.title.agreements'
  },
  {
    value: 'titleNotes',
    label: 'ui-eholdings.exportPackageResources.fields.title.notes'
  },
];

const PACKAGE_EXPORT_FIELDS = [
  {
    value: 'packageLevelToken',
    label: 'ui-eholdings.exportPackageResources.fields.package.packageLevelToken'
  },
  {
    value: 'providerName',
    label: 'ui-eholdings.exportPackageResources.fields.package.providerName'
  },
  {
    value: 'providerId',
    label: 'ui-eholdings.exportPackageResources.fields.package.providerId'
  },
  {
    value: 'packageName',
    label: 'ui-eholdings.exportPackageResources.fields.package.name'
  },
  {
    value: 'packageId',
    label: 'ui-eholdings.exportPackageResources.fields.package.id'
  },
  {
    value: 'packageType',
    label: 'ui-eholdings.exportPackageResources.fields.package.type'
  },
  {
    value: 'packageContentType',
    label: 'ui-eholdings.exportPackageResources.fields.package.contentType'
  },
  {
    value: 'packageHoldingsStatus',
    label: 'ui-eholdings.exportPackageResources.fields.package.holdingStatus'
  },
  {
    value: 'packageCustomCoverage',
    label: 'ui-eholdings.exportPackageResources.fields.package.customCoverage'
  },
  {
    value: 'packageShowToPatrons',
    label: 'ui-eholdings.exportPackageResources.fields.package.showToPatrons'
  },
  {
    value: 'packageAutomaticallySelect',
    label: 'ui-eholdings.exportPackageResources.fields.package.automaticallySelectTitles'
  },
  {
    value: 'packageProxy',
    label: 'ui-eholdings.exportPackageResources.fields.package.proxy'
  },
  {
    value: 'packageAccessStatusType',
    label: 'ui-eholdings.exportPackageResources.fields.package.accessStatusType'
  },
  {
    value: 'packageTags',
    label: 'ui-eholdings.exportPackageResources.fields.package.tags'
  },
  {
    value: 'packageAgreements',
    label: 'ui-eholdings.exportPackageResources.fields.package.agreements'
  },
  {
    value: 'packageNotes',
    label: 'ui-eholdings.exportPackageResources.fields.package.notes'
  },
];

export const FIELDS_BY_RECORD_TYPE = {
  [RECORD_TYPES.PACKAGE]: PACKAGE_EXPORT_FIELDS,
  [RECORD_TYPES.RESOURCE]: RESOURCE_EXPORT_FIELDS,
};

// some fields, like customLabels should be sent to backend like several combined fields: customValue1, customValue2 etc
export const PAYLOAD_READY_FIELDS_BY_RECORD_TYPE = {
  [RECORD_TYPES.PACKAGE]: {
    packageLevelToken: () => ['packageLevelToken'],
    providerName: () => ['providerName'],
    providerId: () => ['providerId'],
    packageName: () => ['packageName'],
    packageId: () => ['packageId'],
    packageType: () => ['packageType'],
    packageContentType: () => ['packageContentType'],
    packageHoldingsStatus: () => ['packageHoldingsStatus'],
    packageCustomCoverage: () => ['packageCustomCoverage'],
    packageShowToPatrons: () => ['packageShowToPatrons'],
    packageAutomaticallySelect: () => ['packageAutomaticallySelect'],
    packageProxy: () => ['packageProxy'],
    packageAccessStatusType: () => ['packageAccessStatusType'],
    packageTags: () => ['packageTags'],
    packageAgreements: () => ['packageAgreements'],
    packageNotes: () => ['packageNotes'],
  },
  [RECORD_TYPES.RESOURCE]: {
    titleName: () => ['titleName'],
    alternateTitles: () => ['alternateTitles'],
    titleId: () => ['titleId'],
    publicationType: () => ['publicationType'],
    titleType: () => ['titleType'],
    titleHoldingsStatus: () => ['titleHoldingsStatus'],
    titleShowToPatrons: () => ['titleShowToPatrons'],
    managedCoverage: () => ['managedCoverage'],
    managedEmbargo: () => ['managedEmbargo'],
    customCoverage: () => ['customCoverage'],
    customEmbargo: () => ['customEmbargo'],
    coverageStatement: () => ['coverageStatement'],
    titleProxy: () => ['titleProxy'],
    url: () => ['url'],
    titleAccessStatusType: () => ['titleAccessStatusType'],
    titleTags: () => ['titleTags'],
    contributors: () => ['contributors'],
    edition: () => ['edition'],
    publisher: () => ['publisher'],
    ISSNPrint: () => ['ISSNPrint'],
    ISSNOnline: () => ['ISSNOnline'],
    ISBNPrint: () => ['ISBNPrint'],
    ISBNOnline: () => ['ISBNOnline'],
    subjects: () => ['subjects'],
    peerReviewed: () => ['peerReviewed'],
    description: () => ['description'],
    customLabel: () => ['customValue1', 'customValue2', 'customValue3', 'customValue4', 'customValue5'],
    titleAgreements: () => ['titleAgreements'],
    titleNotes: () => ['titleNotes'],
  },
};
