import {
  handleSaveKeyFormSubmit,
  getAccessTypeIdsAndNames,
  filterCountFromQuery,
} from './utilities';

describe('utilities', () => {
  describe('handleSaveKeyFormSubmit', () => {
    it('should dispatch Submit event', () => {
      const formRef = {
        dispatchEvent: jest.fn((event) => event),
      };
      const event = {
        preventDefault: jest.fn(),
      };

      handleSaveKeyFormSubmit(formRef)(event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(formRef.dispatchEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAccessTypeIdsAndNames', () => {
    it('should return correct access status types', () => {
      const accessStatusTypes = [{
        id: 'id1',
        attributes: {
          name: 'name1',
        },
      }];
      const expectedAccessStatusTypes = [{
        id: 'id1',
        name: 'name1',
      }];

      expect(getAccessTypeIdsAndNames(accessStatusTypes)).toEqual(expectedAccessStatusTypes);
    });
  });

  describe('filterCountFromQuery', () => {
    describe('when filter param is provided', () => {
      it('should return correct filter count', () => {
        const queryParams = {
          q: 'Some query',
          sort: undefined,
          filter: {
            selected: true,
          },
        };

        expect(filterCountFromQuery(queryParams)).toEqual(2);
      });
    });

    describe('when filter param is not provided', () => {
      it('should return correct filter count', () => {
        const queryParams = {
          q: 'Some query',
          sort: undefined,
        };

        expect(filterCountFromQuery(queryParams)).toEqual(1);
      });
    });
  });
});
