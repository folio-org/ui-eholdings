import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Icon,
} from '@folio/stripes/components';

export const AutomaticallySelectTitles = ({ packageAllowedToAddTitles }) => {
  const packageAllowedToAddTitlesMessage = packageAllowedToAddTitles
    ? <FormattedMessage id="ui-eholdings.yes" />
    : <FormattedMessage id="ui-eholdings.no" />;

  return (
    <KeyValue label={<FormattedMessage id="ui-eholdings.package.packageAllowToAddTitles" />}>
      {packageAllowedToAddTitles !== null
        ? packageAllowedToAddTitlesMessage
        : <Icon icon="spinner-ellipsis" />
      }
    </KeyValue>
  );
};
