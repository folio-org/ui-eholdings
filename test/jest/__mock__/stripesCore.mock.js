import React from 'react';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  stripesConnect: Component => props => <Component {...props} />,
  IfPermission: props => <>{props.children}</>,
}), { virtual: true });
