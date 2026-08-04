import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  KeyValue,
} from '@folio/stripes/components';

export const VisibilityView = ({ visibility }) => (
  <KeyValue label={<FormattedMessage id="ui-eholdings.package.visibility" />}>
    {visibility.map(visibilityOption => (
      <Checkbox
        label={<FormattedMessage id={`ui-eholdings.package.visibility.${visibilityOption.category}`} />}
        checked={visibilityOption.hidden}
        disabled
      />
    ))}
  </KeyValue>
);
