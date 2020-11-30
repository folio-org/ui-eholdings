import React from 'react';
import {
  FormattedNumber,
} from 'react-intl';

import {
  NoValue,
} from '@folio/stripes/components';

export const formatCost = (value, currencySymbol, currency) => {
  return (
    <FormattedNumber
      value={value}
    >
      {(formattedNumber) => `${currencySymbol}${formattedNumber} (${currency})`}
    </FormattedNumber>
  );
};

export const formatValue = (value, formatter) => {
  const number = Number(value);

  if (!number && number !== 0) {
    return <NoValue />;
  }

  const valueToFixed = number.toFixed(2);

  return formatter ? formatter(valueToFixed) : valueToFixed;
};
