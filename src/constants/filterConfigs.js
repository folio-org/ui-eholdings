import { FormattedMessage } from 'react-intl';

export const baseSortFilterConfig = {
  name: 'sort',
  label: <FormattedMessage id="ui-eholdings.label.sortOptions" />,
  defaultValue: 'relevance',
};

export const providerSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { labelId: 'ui-eholdings.filter.sortOptions.relevance', value: 'relevance' },
    { labelId: 'ui-eholdings.label.provider', value: 'name' }
  ],
};

export const packageSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { labelId: 'ui-eholdings.filter.sortOptions.relevance', value: 'relevance' },
    { labelId: 'ui-eholdings.label.package', value: 'name' }
  ],
};

export const selectionStatusFilterOptions = {
  ALL: 'all',
  TRUE: 'true',
  FALSE: 'false',
};

export const packageAccessFilterOptions = {
  ALL: 'all',
  PUBLIC: 'public',
  CONTROLLED: 'controlled',
};

export const EBSCO_PROVIDER_ID = 19;

export const selectionStatusDefaultFilterOption = selectionStatusFilterOptions.ALL;

export const FILTER_TYPES = {
  SELECT: 'select',
  CHECKBOX: 'checkbox',
};

export const selectionStatusFilterConfig = {
  type: FILTER_TYPES.CHECKBOX,
  name: 'selected',
  label: <FormattedMessage id="ui-eholdings.label.selectionStatus" />,
  defaultValue: selectionStatusDefaultFilterOption,
  options: [
    {
      labelId: 'ui-eholdings.filter.all',
      value: selectionStatusFilterOptions.ALL,
    },
    {
      labelId: 'ui-eholdings.selected',
      value: selectionStatusFilterOptions.TRUE,
    },
    {
      labelId: 'ui-eholdings.notSelected',
      value: selectionStatusFilterOptions.FALSE,
    },
  ]
};

export const publicationTypeTitlesListFilterConfig = {
  type: FILTER_TYPES.SELECT,
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.label.publicationType" />,
  defaultValue: 'all',
  options: [
    { labelId: 'ui-eholdings.filter.all', value: 'all' },
    { labelId: 'ui-eholdings.filter.pubType.audiobook', value: 'audiobook' },
    { labelId: 'ui-eholdings.filter.pubType.book', value: 'book' },
    { labelId: 'ui-eholdings.filter.pubType.book_series', value: 'bookseries' },
    { labelId: 'ui-eholdings.filter.pubType.database', value: 'database' },
    { labelId: 'ui-eholdings.filter.pubType.journal', value: 'journal' },
    { labelId: 'ui-eholdings.filter.pubType.newsletter', value: 'newsletter' },
    { labelId: 'ui-eholdings.filter.pubType.newspaper', value: 'newspaper' },
    { labelId: 'ui-eholdings.filter.pubType.proceedings', value: 'proceedings' },
    { labelId: 'ui-eholdings.filter.pubType.report', value: 'report' },
    { labelId: 'ui-eholdings.filter.pubType.streaming_audio', value: 'streamingaudio' },
    { labelId: 'ui-eholdings.filter.pubType.streaming_video', value: 'streamingvideo' },
    { labelId: 'ui-eholdings.filter.pubType.thesis_dissertation', value: 'thesisdissertation' },
    { labelId: 'ui-eholdings.filter.pubType.website', value: 'website' },
    { labelId: 'ui-eholdings.filter.pubType.unspecified', value: 'unspecified' }
  ]
};

export const titleSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { labelId: 'ui-eholdings.filter.sortOptions.relevance', value: 'relevance' },
    { labelId: 'ui-eholdings.label.title', value: 'name' }
  ],
};

export const contentTypeFilterConfig = {
  type: FILTER_TYPES.SELECT,
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.package.contentType" />,
  defaultValue: 'all',
  options: [
    { labelId: 'ui-eholdings.filter.all', value: 'all' },
    { labelId: 'ui-eholdings.filter.contentType.aggregated', value: 'aggregatedfulltext' },
    { labelId: 'ui-eholdings.filter.contentType.abstract', value: 'abstractandindex' },
    { labelId: 'ui-eholdings.filter.contentType.ebook', value: 'ebook' },
    { labelId: 'ui-eholdings.filter.contentType.ejournal', value: 'ejournal' },
    { labelId: 'ui-eholdings.filter.contentType.mixed_content', value: 'mixedcontent' },
    { labelId: 'ui-eholdings.filter.contentType.online_reference', value: 'onlinereference' },
    { labelId: 'ui-eholdings.filter.contentType.print', value: 'print' },
    { labelId: 'ui-eholdings.filter.contentType.streaming_media', value: 'streamingmedia' },
    { labelId: 'ui-eholdings.filter.contentType.unknown', value: 'unknown' }
  ],
};

export const packageAccessFilterConfig = {
  type: FILTER_TYPES.CHECKBOX,
  name: 'access',
  label: <FormattedMessage id="ui-eholdings.package.packageAccess" />,
  defaultValue: packageAccessFilterOptions.ALL,
  options: [
    {
      labelId: 'ui-eholdings.filter.all',
      value: packageAccessFilterOptions.ALL,
    },
    {
      labelId: 'ui-eholdings.filter.packageAccess.public',
      value: packageAccessFilterOptions.PUBLIC,
    },
    {
      labelId: 'ui-eholdings.filter.packageAccess.controlled',
      value: packageAccessFilterOptions.CONTROLLED,
    },
  ],
};
