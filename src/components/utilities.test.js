import {
  handleSaveKeyFormSubmit,
  getAccessTypeIdsAndNames,
  filterCountFromQuery,
  getMatchedStringInUTF8,
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
});
