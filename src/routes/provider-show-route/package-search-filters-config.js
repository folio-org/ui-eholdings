import { FormattedMessage } from 'react-intl';

import { FILTER_TYPES } from '../../constants';

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
  ]
};
