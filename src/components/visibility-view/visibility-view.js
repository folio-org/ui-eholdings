import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  KeyValue,
} from '@folio/stripes/components';

export const VisibilityView = ({ visibility, recordType }) => (
  <KeyValue label={<FormattedMessage id={`ui-eholdings.${recordType}.visibility`} />}>
    {visibility.map(visibilityOption => (
      <Checkbox
        key={visibilityOption.category}
        label={<FormattedMessage id={`ui-eholdings.visibility.${visibilityOption.category}`} />}
        checked={visibilityOption.hidden}
        disabled
      />
    ))}
  </KeyValue>
);
