import React from 'react';
import { render } from '@testing-library/react';

import AccessTypeDisplay from './access-type-display';
/*
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  KeyValue: jest.fn(({ label, children }) => (
    <>
      {label}
      {children}
    </>
  )),
  NoValue: message => <span>{message}</span>,
}));
*/
const renderAccessTypeDisplay = ({ accessTypeId, accessStatusTypes } = {}) => render(
  <AccessTypeDisplay
    accessTypeId={accessTypeId}
    accessStatusTypes={accessStatusTypes}
  />
);

describe('Given Access Type Display', () => {
  let accessTypeId;
  let accessStatusTypes;

  beforeEach(() => {
    accessTypeId = '1';
    accessStatusTypes = [{ id: '1', name: 'name1' }];
  });

  it('should display selected acces type', () => {
    const { getByText } = renderAccessTypeDisplay({ accessStatusTypes, accessTypeId });

    expect(getByText()).toBeDefined();
  });
});
