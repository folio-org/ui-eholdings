import { FormattedMessage } from 'react-intl';

import { FILTER_TYPES } from '../../constants';

export const publicationTypeFilterConfig = {
  type: FILTER_TYPES.CHECKBOX,
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
