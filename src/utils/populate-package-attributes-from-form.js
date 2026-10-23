import { dayjs } from '@folio/stripes/components';

import { accessTypes } from '../constants';

export const populatePackageAttributesFromForm = (values, model = {}) => {
  const attrs = {};

  if ('isSelected' in values) {
    attrs.isSelected = values.isSelected;
  }

  if ('visibility' in values) {
    attrs.visibility = values.visibility;
  }

  if ('allowKbToAddTitles' in values) {
    attrs.allowKbToAddTitles = values.allowKbToAddTitles;
  }

  if ('name' in values) {
    attrs.name = values.name;
  }

  if ('contentType' in values) {
    attrs.contentType = values.contentType;
  }

  if (values.url?.trim().length) {
    attrs.url = values.url;
  } else {
    delete attrs.url;
  }

  if ('proxyId' in values) {
    attrs.proxy = {
      ...(model.proxy),
      id: values.proxyId,
      inherited: false,
    };
  }

  if ('packageTokenValue' in values) {
    attrs.packageToken = {
      ...model.packageToken,
      value: values.packageTokenValue,
    };
  }

  attrs.isCustom = model?.isCustom;
  attrs.isPartiallySelected = model?.isPartiallySelected;
  attrs.isFreeAccess = values.isFreeAccess;

  // only send altName property of form fields, and filter out any empty fields, if present
  attrs.customAltNames = values.customAltNames
    ?.map(altNameObj => ({
      altName: altNameObj.altName,
    }))
    .filter(({ altName }) => altName?.trim().length);

  // customDisplayName must not be empty
  if (values.customDisplayName?.trim().length) {
    attrs.customDisplayName = values.customDisplayName;
  }

  // customDescription must not be empty
  if (values.customDescription?.trim().length) {
    attrs.customDescription = values.customDescription;
  }

  if (values?.customCoverages?.[0]) {
    attrs.customCoverage = {
      beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
        dayjs.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD'),
      endCoverage: !values.customCoverages[0].endCoverage ? '' :
        dayjs.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD')
    };
  }

  attrs.accessTypeId = values.accessTypeId !== accessTypes.ACCESS_TYPE_NONE_ID
    ? values.accessTypeId
    : null;

  return attrs;
};
