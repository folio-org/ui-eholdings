import { FormattedMessage } from 'react-intl';

const baseSortFilterConfig = {
  name: 'sort',
  label: <FormattedMessage id="ui-eholdings.label.sortOptions" />,
  defaultValue: 'relevance',
};

export const providerSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { label: <FormattedMessage id="ui-eholdings.filter.sortOptions.relevance" />, value: 'relevance' },
    { label: <FormattedMessage id="ui-eholdings.label.provider" />, value: 'name' }
  ],
};

export const packageSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { label: <FormattedMessage id="ui-eholdings.filter.sortOptions.relevance" />, value: 'relevance' },
    { label: <FormattedMessage id="ui-eholdings.label.package" />, value: 'name' }
  ],
};

export const titleSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { label: <FormattedMessage id="ui-eholdings.filter.sortOptions.relevance" />, value: 'relevance' },
    { label: <FormattedMessage id="ui-eholdings.label.title" />, value: 'name' }
  ],
};

export const selectionStatusFilterOptions = {
  ALL: 'all',
  TRUE: 'true',
  FALSE: 'false',
};

export const EBSCO_PROVIDER_ID = 19;

export const selectionStatusDefaultFilterOption = selectionStatusFilterOptions.ALL;

export const selectionStatusFilterConfig = {
  name: 'selected',
  label: <FormattedMessage id="ui-eholdings.label.selectionStatus" />,
  defaultValue: selectionStatusDefaultFilterOption,
  options: [
    {
      label: <FormattedMessage id="ui-eholdings.filter.all" />,
      value: selectionStatusFilterOptions.ALL,
    },
    {
      label: <FormattedMessage id="ui-eholdings.selected" />,
      value: selectionStatusFilterOptions.TRUE,
    },
    {
      label: <FormattedMessage id="ui-eholdings.notSelected" />,
      value: selectionStatusFilterOptions.FALSE,
    },
  ]
};

export const publicationTypeFilterConfig = {
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.label.publicationType" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-eholdings.filter.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.audioBook" />, value: 'audiobook' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.book" />, value: 'book' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.bookSeries" />, value: 'bookseries' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.database" />, value: 'database' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.journal" />, value: 'journal' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.newsletter" />, value: 'newsletter' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.newspaper" />, value: 'newspaper' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.proceedings" />, value: 'proceedings' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.report" />, value: 'report' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.streamingAudio" />, value: 'streamingaudio' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.streamingVideo" />, value: 'streamingvideo' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.thesisdissertation" />, value: 'thesisdissertation' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.website" />, value: 'website' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.unspecified" />, value: 'unspecified' }
  ]
};

export const contentTypeFilterConfig = {
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.package.contentType" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-eholdings.filter.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.aggregated" />, value: 'aggregatedfulltext' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.abstract" />, value: 'abstractandindex' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.ebook" />, value: 'ebook' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.ejournal" />, value: 'ejournal' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.mixedContent" />, value: 'mixedcontent' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.onlineReference" />, value: 'onlinereference' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.print" />, value: 'print' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.streamingMedia" />, value: 'streamingmedia' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.unknown" />, value: 'unknown' }
  ]
};
