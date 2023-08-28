import { render } from '@folio/jest-config-stripes/testing-library/react';

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
      accessStatusTypes = {
        items: {
          data: [{
            id: 'id1',
            attributes: {
              name: 'name1',
            },
          }],
        },
      };
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
      accessStatusTypes = {
        items: {
          data: [{
            id: 'id1',
            attributes: {
              name: 'name1',
            },
          }],
        },
      };
    });

    it('should display selected access type', () => {
      const { getByText } = renderAccessTypeDisplay({ accessStatusTypes, accessTypeId });

      expect(getByText('ui-eholdings.accessType.novalue')).toBeDefined();
    });
  });

  describe('when access types were not set up', () => {
    beforeEach(() => {
      accessTypeId = '';
      accessStatusTypes = {
        items: {
          data: [],
        },
      };
    });

    it('should not display access type section', () => {
      const { queryByText } = renderAccessTypeDisplay({ accessStatusTypes, accessTypeId });

      expect(queryByText('ui-eholdings.settings.accessStatusTypes.type')).toBeNull();
    });
  });
});
