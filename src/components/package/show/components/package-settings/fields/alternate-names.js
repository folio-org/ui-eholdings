import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

export const AlternateNames = ({
  customAltNames = [],
  isCustomPackage = false,
}) => {
  const value = customAltNames.length
    ? customAltNames.map(({ altName }) => (
      <>
        {altName}
        <br />
      </>
    ))
    : <NoValue />;

  return (
    <KeyValue
      label={(
        <FormattedMessage
          id={`ui-eholdings.package.${isCustomPackage ? 'customAltNames' : 'managedAltNames'}`}
        />
      )}
      value={value}
    />
  );
};
