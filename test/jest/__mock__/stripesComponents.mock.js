import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.mock('@folio/stripes/components'),
  KeyValue: jest.fn(({ label, children }) => (
    <>
      {label}
      {children}
    </>
  )),
  NoValue: (message = '-') => <span>{message}</span>,
}));