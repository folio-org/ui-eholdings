import { render } from '@folio/jest-config-stripes/testing-library/react';

import AccessTypeEditSection from './access-type-edit-section';

jest.mock('../access-type-field', () => () => <span>AccessTypeField</span>);

const renderAccessTypeEditSection = ({ accessStatusTypes }) => render(
  <AccessTypeEditSection
    accessStatusTypes={accessStatusTypes}
  />
);

describe('Given AccessTypeEditSection', () => {
  let accessStatusTypes;

  describe('when access status types presented', () => {
    beforeEach(() => {
      accessStatusTypes = {
        isDeleted: false,
        isLoading: false,
        items: {
          data: [{
            id: 'id1',
            type: 'accessTypes',
            attributes: {
              name: 'name1',
            },
          }],
        },
      };
    });

    it('should show AccessTypeField', () => {
      const { getByText } = renderAccessTypeEditSection({ accessStatusTypes });

      expect(getByText('AccessTypeField')).toBeDefined();
    });
  });

  describe('when access status types are loading', () => {
    beforeEach(() => {
      accessStatusTypes = {
        isDeleted: false,
        isLoading: true,
        items: {
          data: [{
            id: 'id1',
            type: 'accessTypes',
            attributes: {
              name: 'name1',
            },
          }],
        },
      };
    });

    it('should show spinner', () => {
      const { container } = renderAccessTypeEditSection({ accessStatusTypes });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when no any access status types', () => {
    beforeEach(() => {
      accessStatusTypes = {
        isDeleted: false,
        isLoading: false,
        items: { data: [] },
      };
    });

    it('should not show access type field', () => {
      const { queryByText, container } = renderAccessTypeEditSection({ accessStatusTypes });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeNull();
      expect(queryByText('AccessTypeField')).toBeNull();
    });
  });
});
