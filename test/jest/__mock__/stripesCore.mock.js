import React from 'react';

jest.mock('@folio/stripes/core', () => ({
  ...require.requireActual('@folio/stripes/core'),
  stripesConnect: Component => props => <Component {...props} />,
}), { virtual: true });
