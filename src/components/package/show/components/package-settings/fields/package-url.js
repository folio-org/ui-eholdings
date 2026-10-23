import { FormattedMessage } from 'react-intl';

import { KeyValue, NoValue } from '@folio/stripes/components';

import ExternalLink from '../../../../../external-link';

export const PackageUrl = ({ url }) => (
  <KeyValue label={<FormattedMessage id="ui-eholdings.label.packageUrl" />}>
    {url ? (
      <ExternalLink
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      />
    ) : <NoValue />}
  </KeyValue>
);
