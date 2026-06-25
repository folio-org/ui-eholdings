import { FormattedMessage } from 'react-intl';

import { FILTER_TYPES } from '../../constants';

export const contentTypeFilterConfig = {
  type: FILTER_TYPES.SELECT,
  name: 'type',
  label: <FormattedMessage id="ui-eholdings.package.contentType" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-eholdings.filter.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.aggregated" />, value: 'aggregatedfulltext' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.abstract" />, value: 'abstractandindex' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.ebook" />, value: 'ebook' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.ejournal" />, value: 'ejournal' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.mixed_content" />, value: 'mixedcontent' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.online_reference" />, value: 'onlinereference' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.print" />, value: 'print' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.streaming_media" />, value: 'streamingmedia' },
    { label: <FormattedMessage id="ui-eholdings.filter.contentType.unknown" />, value: 'unknown' }
  ]
};
