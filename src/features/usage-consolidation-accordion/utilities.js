import React from 'react';
import {
  FormattedNumber,
} from 'react-intl';
import getSymbolFromCurrency from 'currency-symbol-map';

import {
  NoValue,
} from '@folio/stripes/components';

export const formatCost = (currency, value) => {
  const currencySymbol = getSymbolFromCurrency(currency) || '';

  return (
    <FormattedNumber value={value}>
      {(formattedNumber) => `${currencySymbol}${formattedNumber} (${currency})`}
    </FormattedNumber>
  );
};

export const formatValue = (value, callback) => {
  const number = typeof value === 'string' ? Number(value) : value;

  if (!number && number !== 0) {
    return <NoValue />;
  }

  const valueToFixed = number.toFixed(2);

  return callback ? callback(valueToFixed) : valueToFixed;
};
