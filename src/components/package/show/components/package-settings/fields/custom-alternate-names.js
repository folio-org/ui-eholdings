import { FormattedMessage } from 'react-intl';

import { KeyValue, NoValue } from '@folio/stripes/components';

export const CustomAlternateNames = ({ customAltNames = [] }) => {
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
      label={<FormattedMessage id="ui-eholdings.package.customAltNames" />}
      value={value}
    />
  );
};
