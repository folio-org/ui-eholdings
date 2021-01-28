import React from 'react';
import { render } from '@testing-library/react';

import AccessTypeDisplay from './access-type-display';

const renderAccessTypeDisplay = ({ accessTypeId, accessStatusTypes }) => render(
  <AccessTypeDisplay
    accessTypeId={accessTypeId}
    accessStatusTypes={accessStatusTypes}
  />
);

describe('Given Access Type Display', () => {
  let accessTypeId;
  let accessStatusTypes;

  describe('when access type presented', () => {
    beforeEach(() => {
      accessTypeId = 'id1';
      accessStatusTypes = [{ id: 'id1', name: 'name1' }];
    });

    it('should display correct access type label', () => {
      const { getByText } = renderAccessTypeDisplay({ accessStatusTypes, accessTypeId });

      expect(getByText('ui-eholdings.settings.accessStatusTypes.type')).toBeDefined();
    });

    it('should display selected access type', () => {
      const { getByText } = renderAccessTypeDisplay({ accessStatusTypes, accessTypeId });

      expect(getByText('name1')).toBeDefined();
    });
  });

  describe('when access type did not found', () => {
    beforeEach(() => {
      accessTypeId = '';
      accessStatusTypes = [{ id: 'id1', name: 'name1' }];
    });

    it('should display selected access type', () => {
      const { getByText } = renderAccessTypeDisplay({ accessStatusTypes, accessTypeId });

      expect(getByText('ui-eholdings.accessType.novalue')).toBeDefined();
    });
  });
});
