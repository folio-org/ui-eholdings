import { FormattedMessage } from 'react-intl';

import {
  Icon,
  KeyValue,
} from '@folio/stripes/components';

import TokenDisplay from '../../../../../token-display';

export const ProviderToken = ({ provider }) => (
  provider.isLoading
    ? <Icon icon="spinner-ellipsis" />
    : (
      <KeyValue label={<FormattedMessage id="ui-eholdings.provider.token" />}>
        <TokenDisplay
          token={provider.providerToken}
          type="provider"
        />
      </KeyValue>
    )
);
