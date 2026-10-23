import { FormattedMessage } from 'react-intl';

import {
  Editor,
  NoValue,
  KeyValue,
} from '@folio/stripes/components';

export const Description = ({
  description,
  isCustomPackage = false,
}) => (
  <KeyValue
    label={(
      <FormattedMessage
        id={`ui-eholdings.${isCustomPackage ? 'label.customDescription' : 'package.managedDescription'}`}
      />
    )}
  >
    {description ? (
      <Editor
        value={description}
        readOnly
        modules={{ toolbar: false }}
      />
    ) : <NoValue />}
  </KeyValue>
);
