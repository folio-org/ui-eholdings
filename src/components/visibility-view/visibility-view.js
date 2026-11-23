import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  KeyValue,
} from '@folio/stripes/components';

import entityTypes from '../../constants/entityTypes';

import css from './visibility-view.css';

export const VisibilityView = ({ visibility, recordType }) => {
  const setByPackageMessage = useMemo(() => (
    <span className={css.setByPackageMessage}>
      <FormattedMessage id="ui-eholdings.visibility.setByPackage" />
    </span>
  ), []);

  return (
    <KeyValue label={<FormattedMessage id={`ui-eholdings.${recordType}.visibility`} />}>
      {visibility.map(visibilityOption => (
        <Checkbox
          key={visibilityOption.category}
          label={(
            <>
              <FormattedMessage id={`ui-eholdings.visibility.${visibilityOption.category}`} />
              {(recordType === entityTypes.RESOURCE && visibilityOption.hidden) ? setByPackageMessage : null}
            </>
          )}
          checked={visibilityOption.hidden}
          disabled
        />
      ))}
    </KeyValue>
  );
};
