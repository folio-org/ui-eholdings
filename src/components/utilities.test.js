import {
  handleSaveKeyFormSubmit,
  getAccessTypeId,
  getAccessTypeIdsAndNames,
  filterCountFromQuery,
  getMatchedStringInUTF8,
  transformQueryParams,
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

  describe('getAccessTypeId', () => {
    describe('when using Redux shape', () => {
      it('should return correct access type ID', () => {
        const data = {
          data: {
            attributes: {},
            relationships: {
              accessType: {
                data: {
                  id: 'access-type-id'
                },
              },
            },
          },
        };

        expect(getAccessTypeId(data)).toEqual('access-type-id');
      });
    });

    describe('when using React Query shape', () => {
      it('should return correct access type ID', () => {
        const data = {
          relationships: {
            accessType: {
              data: {
                id: 'access-type-id'
              },
            },
          },
        };

        expect(getAccessTypeId(data)).toEqual('access-type-id');
      });
    });

    describe('when unrecognized', () => {
      it('should return undefined', () => {
        const data = {
          accessType: {
            id: 'access-type-id'
          },
        };

        expect(getAccessTypeId(data)).toBeUndefined();
      });
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

  describe('getMatchedStringInUTF8', () => {
    describe('when string contains allowed characters', () => {
      it('should return the same string', () => {
        const inputString = 'Just some test string';

        const resultString = getMatchedStringInUTF8(inputString);

        expect(resultString).toEqual(inputString);
      });
    });

    describe('when string contains allowed special characters (: ; - . ! ~ \' ( ) [ ])', () => {
      it('should return the same string', () => {
        const inputString = 'Holds : ; - . ! ~ \' [ ] ( ) characters';

        const resultString = getMatchedStringInUTF8(inputString);

        expect(resultString).toEqual(inputString);
      });
    });

    describe('when string contains special characters other than allowed (: ; - . ! ~ \' ( ) [ ])', () => {
      it('should return a string without these special characters', () => {
        const inputString = 'Holds * and / characters';
        const outputString = 'Holds  and  characters';

        const resultString = getMatchedStringInUTF8(inputString);

        expect(resultString).toEqual(outputString);
      });
    });

    describe('when string contains just non-allowed special characters', () => {
      it('should return an empty string', () => {
        const inputString = '*/';

        const resultString = getMatchedStringInUTF8(inputString);

        expect(resultString).toEqual('');
      });
    });
  });

  describe('transformQueryParams', () => {
    it('should send field and mode as q[field] and q[type]', () => {
      expect(transformQueryParams('packages', {
        q: 'abc',
        searchfield: 'keyword',
        searchmode: 'exactmatch',
        sort: 'name',
      })).toEqual({
        q: 'abc',
        'q[field]': 'keyword',
        'q[type]': 'exactmatch',
        sort: 'name',
      });
    });

    it('should use the defaults when field and mode are missing', () => {
      expect(transformQueryParams('packages', { q: 'abc' })).toEqual({
        q: 'abc',
        'q[field]': 'name',
        'q[type]': 'advanced',
      });
    });

    it('should send the title field as name', () => {
      expect(transformQueryParams('titles', { q: 'abc', searchfield: 'title' })).toEqual(
        expect.objectContaining({ 'q[field]': 'name' })
      );
    });

    it('should keep title only fields and modes for titles', () => {
      expect(transformQueryParams('titles', { q: 'abc', searchfield: 'isxn', searchmode: 'proximity' })).toEqual(
        expect.objectContaining({ 'q[field]': 'isxn', 'q[type]': 'proximity' })
      );
    });

    it('should fall back to the defaults for a field and mode not valid for packages', () => {
      expect(transformQueryParams('packages', { q: 'abc', searchfield: 'isxn', searchmode: 'proximity' })).toEqual(
        expect.objectContaining({ 'q[field]': 'name', 'q[type]': 'advanced' })
      );
    });

    it('should fall back to the defaults for a field and mode not valid for titles', () => {
      expect(transformQueryParams('titles', { q: 'abc', searchfield: 'keyword', searchmode: 'bogus' })).toEqual(
        expect.objectContaining({ 'q[field]': 'name', 'q[type]': 'advanced' })
      );
    });

    it('should not add field or mode without a query', () => {
      expect(transformQueryParams('packages', { searchfield: 'keyword', searchmode: 'any' })).toEqual({});
    });

    it('should leave other search types untouched', () => {
      const params = { q: 'abc', searchfield: 'name' };

      expect(transformQueryParams('providers', params)).toBe(params);
    });
  });
});
