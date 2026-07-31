import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

export const IsHidden = ({ visibilityData }) => (
  <KeyValue label={<FormattedMessage id="ui-eholdings.package.visibility" />}>
    {!visibilityData
      ? <FormattedMessage id="ui-eholdings.yes" />
      : (
        <FormattedMessage
          id="ui-eholdings.package.visibility.no"
          values={{ visibilityMessage: visibilityData.reason && `(${visibilityData.reason})` }}
        />
      )
    }
  </KeyValue>
);
