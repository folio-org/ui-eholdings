import { FormattedMessage } from 'react-intl';

// Make an options list with simple one-to-one filters given a value for each option.
export const simpleOptions = (name, defaultValue, options) => options.map(({ labelId, value }) => ({
  labelId,
  filters: { [name]: value },
  isDefault: value === defaultValue,
}));

export const baseSortFilterConfig = {
  name: 'sort',
  label: <FormattedMessage id="ui-eholdings.label.sortOptions" />,
};

export const providerSortFilterConfig = {
  ...baseSortFilterConfig,
  options: simpleOptions('sort', 'relevance', [
    { labelId: 'ui-eholdings.filter.sortOptions.relevance', value: 'relevance' },
    { labelId: 'ui-eholdings.label.provider', value: 'name' }
  ]),
};

export const packageSortFilterConfig = {
  ...baseSortFilterConfig,
  options: simpleOptions('sort', 'relevance', [
    { labelId: 'ui-eholdings.filter.sortOptions.relevance', value: 'relevance' },
    { labelId: 'ui-eholdings.label.package', value: 'name' }
  ]),
};

export const selectionStatusFilterOptions = {
  ALL: 'all',
  TRUE: 'true',
  FALSE: 'false',
  ORDERED: 'ebsco',
};

export const visibilityStatusFilterOptions = {
  VISIBLE_SOMEWHERE: 'visibleSomewhere',
  HIDDEN_SOMEWHERE: 'hiddenSomewhere',
  HIDDEN_PF: 'hiddenInPF',
  HIDDEN_FTF: 'hiddenInFTF',
  HIDDEN_MARC: 'hiddenInMARC',
};

export const packageAccessFilterOptions = {
  ALL: 'all',
  PUBLIC: 'public',
  CONTROLLED: 'controlled',
};

export const EBSCO_PROVIDER_ID = 19;

export const FILTER_TYPES = {
  SELECT: 'select',
  SELECTION: 'selection',
  CHECKBOX: 'checkbox',
};

const selectedFilters = (selected, visibility) => ({
  selected,
  ...(visibility && { visibility }),
});

export const selectionStatusVisibilityFilterConfig = {
  type: FILTER_TYPES.SELECTION,
  name: 'selectedVisibilityStatus',
  label: <FormattedMessage id="ui-eholdings.label.selectionStatus" />,
  options: [
    {
      labelId: 'ui-eholdings.label.selectionStatus',
      options: [
        {
          labelId: 'ui-eholdings.filter.all',
          filters: {},
          isDefault: true,
        },
        {
          labelId: 'ui-eholdings.selected',
          filters: selectedFilters(selectionStatusFilterOptions.TRUE),
        },
        {
          labelId: 'ui-eholdings.notSelected',
          filters: selectedFilters(selectionStatusFilterOptions.FALSE),
        },
        {
          labelId: 'ui-eholdings.label.orderedThrough',
          filters: selectedFilters(selectionStatusFilterOptions.ORDERED),
        },
      ],
    },
    {
      labelId: 'ui-eholdings.label.visibilityStatus',
      options: [
        {
          labelId: 'ui-eholdings.label.visibleSomewhere',
          filters: selectedFilters(selectionStatusFilterOptions.TRUE, visibilityStatusFilterOptions.VISIBLE_SOMEWHERE),
        },
        {
          labelId: 'ui-eholdings.label.hiddenSomewhere',
          filters: selectedFilters(selectionStatusFilterOptions.TRUE, visibilityStatusFilterOptions.HIDDEN_SOMEWHERE),
        },
        {
          labelId: 'ui-eholdings.label.hiddenPF',
          filters: selectedFilters(selectionStatusFilterOptions.TRUE, visibilityStatusFilterOptions.HIDDEN_PF),
        },
        {
          labelId: 'ui-eholdings.label.hiddenFTF',
          filters: selectedFilters(selectionStatusFilterOptions.TRUE, visibilityStatusFilterOptions.HIDDEN_FTF),
        },
        {
          labelId: 'ui-eholdings.label.hiddenMARC',
          filters: selectedFilters(selectionStatusFilterOptions.TRUE, visibilityStatusFilterOptions.HIDDEN_MARC),
        },
      ],
    },
  ],
};

export const selectionStatusFilterConfig = {
  type: FILTER_TYPES.CHECKBOX,
  name: 'selected',
  label: <FormattedMessage id="ui-eholdings.label.selectionStatus" />,
  options: simpleOptions('selected', selectionStatusFilterOptions.ALL, [
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
  ]),
};

export const publicationTypeTitlesListFilterConfig = {
  type: FILTER_TYPES.SELECT,
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.label.publicationType" />,
  options: simpleOptions('type', 'all', [
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
  ]),
};

export const titleSortFilterConfig = {
  ...baseSortFilterConfig,
  options: simpleOptions('sort', 'relevance', [
    { labelId: 'ui-eholdings.filter.sortOptions.relevance', value: 'relevance' },
    { labelId: 'ui-eholdings.label.title', value: 'name' }
  ]),
};

export const contentTypeFilterConfig = {
  type: FILTER_TYPES.SELECT,
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.package.contentType" />,
  options: simpleOptions('type', 'all', [
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
  ]),
};

export const packageAccessFilterConfig = {
  type: FILTER_TYPES.CHECKBOX,
  name: 'access',
  label: <FormattedMessage id="ui-eholdings.package.packageAccess" />,
  options: simpleOptions('access', packageAccessFilterOptions.ALL, [
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
  ]),
};
