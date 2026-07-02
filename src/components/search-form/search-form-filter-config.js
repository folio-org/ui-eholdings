import { FormattedMessage } from 'react-intl';

import { FILTER_TYPES } from '../../constants';

export const publicationTypeFilterConfig = {
  type: FILTER_TYPES.CHECKBOX,
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.label.publicationType" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-eholdings.filter.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.audiobook" />, value: 'audiobook' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.book" />, value: 'book' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.book_series" />, value: 'bookseries' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.database" />, value: 'database' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.journal" />, value: 'journal' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.newsletter" />, value: 'newsletter' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.newspaper" />, value: 'newspaper' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.proceedings" />, value: 'proceedings' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.report" />, value: 'report' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.streaming_audio" />, value: 'streamingaudio' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.streaming_video" />, value: 'streamingvideo' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.thesis_dissertation" />, value: 'thesisdissertation' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.website" />, value: 'website' },
    { label: <FormattedMessage id="ui-eholdings.filter.pubType.unspecified" />, value: 'unspecified' }
  ]
};
