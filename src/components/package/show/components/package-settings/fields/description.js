import { FormattedMessage } from 'react-intl';

import {
  Editor,
  NoValue,
  KeyValue,
} from '@folio/stripes/components';

import styles from './description.css';

export const Description = ({
  description,
  isCustomField = false,
}) => (
  <KeyValue
    label={(
      <FormattedMessage
        id={`ui-eholdings.${isCustomField ? 'label.customDescription' : 'package.managedDescription'}`}
      />
    )}
  >
    {description ? (
      <Editor
        value={description}
        readOnly
        modules={{ toolbar: false }}
        className={styles.editor}
      />
    ) : <NoValue />}
  </KeyValue>
);
