import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

export const PackageDisplayName = ({ packageDisplayName }) => (
  <KeyValue
    label={<FormattedMessage id="ui-eholdings.package.packageDisplayName" />}
    value={packageDisplayName}
  />
);
