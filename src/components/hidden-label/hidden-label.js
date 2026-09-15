import { FormattedMessage } from 'react-intl';

import { Icon } from '@folio/stripes/components';

export default function HiddenLabel() {
  return (
    <Icon icon="eye-closed">
      <span data-test-hidden-label>
        <FormattedMessage id="ui-eholdings.hidden" />
      </span>
    </Icon>
  );
}
