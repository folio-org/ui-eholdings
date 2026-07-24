import { FormattedMessage } from 'react-intl';

import {
  Icon,
  KeyValue,
} from '@folio/stripes/components';

import TokenDisplay from '../../../../../token-display';

export const PackageToken = ({ packageLoading, packageToken }) => (
  packageLoading
    ? <Icon icon="spinner-ellipsis" />
    : (
      <KeyValue label={<FormattedMessage id="ui-eholdings.package.token" />}>
        <TokenDisplay
          token={packageToken}
          type="package"
        />
      </KeyValue>
    )
);
